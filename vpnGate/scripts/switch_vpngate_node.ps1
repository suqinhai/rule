param(
    [string]$Project = "",
    [string]$Zone = "asia-northeast1-b",
    [string]$InstanceName = "vpngate-relay",
    [Parameter(Mandatory = $true)]
    [string]$VpnGateConfig,
    [string]$SshUser = "vpnrelay"
)

$ErrorActionPreference = "Stop"
$GcloudCommand = $null

function Resolve-GcloudCommand {
    $candidates = @("gcloud.cmd", "gcloud")

    foreach ($candidate in $candidates) {
        $command = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($command) {
            return $command.Source
        }
    }

    return $null
}

function Invoke-Gcloud {
    param([string[]]$Arguments)

    & $script:GcloudCommand @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "gcloud command failed: $script:GcloudCommand $($Arguments -join ' ')"
    }
}

function Invoke-GcloudCapture {
    param([string[]]$Arguments)

    $output = & $script:GcloudCommand @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "gcloud command failed: $script:GcloudCommand $($Arguments -join ' ')"
    }

    return ($output | Out-String).Trim()
}

function Get-SshTarget {
    param([string]$InstanceName)

    if ($script:SshUser) {
        return "$($script:SshUser)@$InstanceName"
    }

    return $InstanceName
}

function Invoke-RemoteCommand {
    param(
        [string]$SshTarget,
        [string]$Zone,
        [string[]]$ProjectArgs,
        [string]$Command
    )

    Invoke-Gcloud (@(
        "compute", "ssh", $SshTarget,
        "--zone", $Zone,
        "--command", $Command
    ) + $ProjectArgs)
}

function Upload-FileByChunksOverSsh {
    param(
        [string]$LocalPath,
        [string]$RemotePath,
        [string]$SshTarget,
        [string]$Zone,
        [string[]]$ProjectArgs
    )

    $resolvedLocalPath = (Resolve-Path -LiteralPath $LocalPath).Path
    $bytes = [System.IO.File]::ReadAllBytes($resolvedLocalPath)
    $base64 = [Convert]::ToBase64String($bytes)
    $chunkSize = 3000
    $remoteBase64Path = "$RemotePath.b64"

    Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "rm -f $RemoteBase64Path $RemotePath"

    for ($offset = 0; $offset -lt $base64.Length; $offset += $chunkSize) {
        $length = [Math]::Min($chunkSize, $base64.Length - $offset)
        $chunk = $base64.Substring($offset, $length)
        Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "printf '%s' '$chunk' >> $RemoteBase64Path"
    }

    Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "base64 -d $RemoteBase64Path > $RemotePath && rm -f $RemoteBase64Path"
}

function Upload-TextByChunksOverSsh {
    param(
        [string]$Text,
        [string]$RemotePath,
        [string]$SshTarget,
        [string]$Zone,
        [string[]]$ProjectArgs
    )

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $base64 = [Convert]::ToBase64String($bytes)
    $chunkSize = 3000
    $remoteBase64Path = "$RemotePath.b64"

    Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "rm -f $remoteBase64Path $RemotePath"

    for ($offset = 0; $offset -lt $base64.Length; $offset += $chunkSize) {
        $length = [Math]::Min($chunkSize, $base64.Length - $offset)
        $chunk = $base64.Substring($offset, $length)
        Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "printf '%s' '$chunk' >> $remoteBase64Path"
    }

    Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "base64 -d $remoteBase64Path > $RemotePath && chmod +x $RemotePath && rm -f $remoteBase64Path"
}

if (-not ($GcloudCommand = Resolve-GcloudCommand)) {
    throw "gcloud was not found. Install Google Cloud CLI and run 'gcloud auth login' first."
}

if (-not (Test-Path -LiteralPath $VpnGateConfig)) {
    throw "VPN Gate config not found: $VpnGateConfig"
}

$ResolvedVpnGateConfig = (Resolve-Path -LiteralPath $VpnGateConfig).Path

$ProjectArgs = @()
if ($Project) {
    $ProjectArgs += @("--project", $Project)
}

$SshTarget = Get-SshTarget -InstanceName $InstanceName

Write-Host "Using VPN Gate config: $ResolvedVpnGateConfig"
Write-Host "Target VM: $InstanceName ($Zone)"
Write-Host "SSH target: $SshTarget"

$RemoteHome = Invoke-GcloudCapture (@(
    "compute", "ssh", $SshTarget,
    "--zone", $Zone,
    "--command", 'printf %s "$HOME"'
) + $ProjectArgs)

if (-not $RemoteHome) {
    throw "Could not determine remote home directory."
}

$RemoteSetupDir = "$RemoteHome/vpngate-relay-switch"
$RemoteVpnGateConfig = "$RemoteSetupDir/vpngate.ovpn"
$RemoteSwitchScript = "$RemoteSetupDir/switch-vpngate-node.sh"

Write-Host "Preparing remote setup directory..."
Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "mkdir -p $RemoteSetupDir"

Write-Host "Uploading VPN Gate config..."
Upload-FileByChunksOverSsh -LocalPath $ResolvedVpnGateConfig -RemotePath $RemoteVpnGateConfig -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs

$RemoteCommandTemplate = @'
set -euo pipefail

REMOTE_CONFIG="${1:?missing remote config path}"
TARGET_CONFIG='/etc/openvpn/client/vpngate.conf'
HOOK='/usr/local/sbin/vpngate-relay-routes.sh'

sudo test -x "$HOOK" || {
  echo "Missing $HOOK. Run deploy_gcp_vpngate_relay.ps1 once first."
  exit 1
}

sudo cp "$REMOTE_CONFIG" "$TARGET_CONFIG"
sudo chmod 600 "$TARGET_CONFIG"

sudo sed -i -E 's/^[[:space:]]*dev[[:space:]]+.*/dev tun-vpngate/' "$TARGET_CONFIG"
sudo grep -Eq '^[[:space:]]*dev[[:space:]]+tun-vpngate[[:space:]]*$' "$TARGET_CONFIG" || \
  printf '\ndev tun-vpngate\n' | sudo tee -a "$TARGET_CONFIG" >/dev/null

sudo sed -i -E 's/^([[:space:]]*)(redirect-gateway\b.*)$/;\1\2/' "$TARGET_CONFIG"

append_if_missing() {
  pattern="$1"
  line="$2"
  sudo grep -Eq "$pattern" "$TARGET_CONFIG" || printf '%s\n' "$line" | sudo tee -a "$TARGET_CONFIG" >/dev/null
}

append_if_missing '^[[:space:]]*route-nopull[[:space:]]*$' 'route-nopull'
append_if_missing '^[[:space:]]*pull-filter[[:space:]]+ignore[[:space:]]+redirect-gateway' 'pull-filter ignore redirect-gateway'
append_if_missing '^[[:space:]]*script-security[[:space:]]+2[[:space:]]*$' 'script-security 2'
append_if_missing '^[[:space:]]*up[[:space:]]+/usr/local/sbin/vpngate-relay-routes.sh' 'up /usr/local/sbin/vpngate-relay-routes.sh'
append_if_missing '^[[:space:]]*down[[:space:]]+/usr/local/sbin/vpngate-relay-routes.sh' 'down /usr/local/sbin/vpngate-relay-routes.sh'
append_if_missing '^[[:space:]]*down-pre[[:space:]]*$' 'down-pre'
append_if_missing '^[[:space:]]*auth-nocache[[:space:]]*$' 'auth-nocache'

sudo systemctl restart openvpn-client@vpngate
sleep 3
sudo systemctl is-active --quiet openvpn-client@vpngate

echo 'Current VPN Gate config:'
sudo grep -nE '^[[:space:]]*(remote|proto|dev)[[:space:]]+' "$TARGET_CONFIG" || true
echo 'Recent OpenVPN client log:'
sudo journalctl -u openvpn-client@vpngate -n 40 --no-pager | grep -E 'link remote|Peer Connection|Initialization|AUTH|ERROR|WARNING' || true
'@

$RemoteScript = $RemoteCommandTemplate -replace "`r`n", "`n"

Write-Host "Switching VPN Gate node and restarting OpenVPN client..."
Upload-TextByChunksOverSsh -Text $RemoteScript -RemotePath $RemoteSwitchScript -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs
Invoke-RemoteCommand -SshTarget $SshTarget -Zone $Zone -ProjectArgs $ProjectArgs -Command "sudo bash $RemoteSwitchScript $RemoteVpnGateConfig"

Write-Host ""
Write-Host "Done. Relay client profile was not changed."

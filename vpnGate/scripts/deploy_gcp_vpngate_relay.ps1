param(
    [string]$Project = "",
    [string]$Zone = "asia-northeast1-b",
    [string]$InstanceName = "vpngate-relay",
    [string]$MachineType = "e2-micro",
    [string]$VpnGateConfig = "",
    [int]$ServerPort = 1194,
    [ValidateSet("udp", "tcp")]
    [string]$Protocol = "udp",
    [string]$SshUser = "vpnrelay",
    [switch]$SkipUpload
)

$ErrorActionPreference = "Stop"
$GcloudCommand = $null
$Protocol = $Protocol.ToLowerInvariant()

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
        [string]$InstanceName,
        [string]$Zone,
        [string[]]$ProjectArgs,
        [string]$Command
    )

    $sshTarget = Get-SshTarget -InstanceName $InstanceName
    Invoke-Gcloud (@(
        "compute", "ssh", $sshTarget,
        "--zone", $Zone,
        "--command", $Command
    ) + $ProjectArgs)
}

function Upload-FileByChunksOverSsh {
    param(
        [string]$LocalPath,
        [string]$RemotePath,
        [string]$InstanceName,
        [string]$Zone,
        [string[]]$ProjectArgs
    )

    $resolvedLocalPath = (Resolve-Path -LiteralPath $LocalPath).Path
    $bytes = [System.IO.File]::ReadAllBytes($resolvedLocalPath)
    $base64 = [Convert]::ToBase64String($bytes)
    $chunkSize = 3000
    $remoteBase64Path = "$RemotePath.b64"

    Invoke-RemoteCommand -InstanceName $InstanceName -Zone $Zone -ProjectArgs $ProjectArgs -Command "rm -f $RemoteBase64Path $RemotePath"

    for ($offset = 0; $offset -lt $base64.Length; $offset += $chunkSize) {
        $length = [Math]::Min($chunkSize, $base64.Length - $offset)
        $chunk = $base64.Substring($offset, $length)
        Invoke-RemoteCommand -InstanceName $InstanceName -Zone $Zone -ProjectArgs $ProjectArgs -Command "printf '%s' '$chunk' >> $RemoteBase64Path"
    }

    Invoke-RemoteCommand -InstanceName $InstanceName -Zone $Zone -ProjectArgs $ProjectArgs -Command "base64 -d $RemoteBase64Path > $RemotePath && rm -f $RemoteBase64Path"
}

function Download-TextFileOverSsh {
    param(
        [string]$RemotePath,
        [string]$LocalPath,
        [string]$InstanceName,
        [string]$Zone,
        [string[]]$ProjectArgs
    )

    $sshTarget = Get-SshTarget -InstanceName $InstanceName
    $content = & $script:GcloudCommand @(
        "compute", "ssh", $sshTarget,
        "--zone", $Zone,
        "--command", "cat $RemotePath"
    ) @ProjectArgs

    if ($LASTEXITCODE -ne 0) {
        throw "gcloud command failed: $script:GcloudCommand compute ssh $sshTarget --zone $Zone --command cat $RemotePath"
    }

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($LocalPath, ($content -join [Environment]::NewLine), $utf8NoBom)
}

function Test-GcloudCommand {
    param([string[]]$Arguments)

    $previousPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = "Continue"
        & $script:GcloudCommand @Arguments 1>$null 2>$null
        return $LASTEXITCODE -eq 0
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }
}

if (-not ($GcloudCommand = Resolve-GcloudCommand)) {
    throw "gcloud was not found. Install Google Cloud CLI and run 'gcloud auth login' first."
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$InstallScript = Join-Path $ScriptDir "install_vpngate_relay.sh"

if (-not (Test-Path $InstallScript)) {
    throw "Missing installer script: $InstallScript"
}

if (-not $VpnGateConfig) {
    $ConfigDir = Join-Path $RepoRoot "vpngate_ovpn_configs"
    $FirstConfig = Get-ChildItem -Path $ConfigDir -Filter "*.ovpn" -ErrorAction SilentlyContinue |
        Sort-Object Name |
        Select-Object -First 1

    if (-not $FirstConfig) {
        throw "No .ovpn file found in $ConfigDir. Generate one first, or pass -VpnGateConfig."
    }

    $VpnGateConfig = $FirstConfig.FullName
}

if (-not (Test-Path $VpnGateConfig)) {
    throw "VPN Gate config not found: $VpnGateConfig"
}

$ProjectArgs = @()
if ($Project) {
    $ProjectArgs += @("--project", $Project)
}

$FirewallName = "$InstanceName-openvpn-$Protocol-$ServerPort"
$FirewallAllow = "$($Protocol):$ServerPort"
$TargetTag = $InstanceName
$SshTarget = Get-SshTarget -InstanceName $InstanceName

Write-Host "Using VPN Gate config: $VpnGateConfig"
Write-Host "Target VM: $InstanceName ($Zone)"
Write-Host "SSH target: $SshTarget"
Write-Host "Relay listener: $($Protocol.ToUpper()) $ServerPort"

$InstanceExists = Test-GcloudCommand (@("compute", "instances", "describe", $InstanceName, "--zone", $Zone) + $ProjectArgs)
if (-not $InstanceExists) {
    Write-Host "Creating Google Cloud VM..."
    Invoke-Gcloud (@(
        "compute", "instances", "create", $InstanceName,
        "--zone", $Zone,
        "--machine-type", $MachineType,
        "--image-family", "ubuntu-2204-lts",
        "--image-project", "ubuntu-os-cloud",
        "--boot-disk-size", "10GB",
        "--tags", $TargetTag,
        "--metadata", "enable-oslogin=FALSE,block-project-ssh-keys=FALSE"
    ) + $ProjectArgs)
} else {
    Write-Host "VM already exists, reusing it."
    Invoke-Gcloud (@(
        "compute", "instances", "add-tags", $InstanceName,
        "--zone", $Zone,
        "--tags", $TargetTag
    ) + $ProjectArgs)
    Invoke-Gcloud (@(
        "compute", "instances", "add-metadata", $InstanceName,
        "--zone", $Zone,
        "--metadata", "enable-oslogin=FALSE,block-project-ssh-keys=FALSE"
    ) + $ProjectArgs)
}

$FirewallExists = Test-GcloudCommand (@("compute", "firewall-rules", "describe", $FirewallName) + $ProjectArgs)
if (-not $FirewallExists) {
    Write-Host "Creating firewall rule for $($Protocol.ToUpper()) $ServerPort..."
    Invoke-Gcloud (@(
        "compute", "firewall-rules", "create", $FirewallName,
        "--allow", $FirewallAllow,
        "--target-tags", $TargetTag,
        "--source-ranges", "0.0.0.0/0",
        "--description", "Allow OpenVPN relay traffic"
    ) + $ProjectArgs)
} else {
    Write-Host "Firewall rule already exists: $FirewallName"
}

Write-Host "Preparing remote setup directory..."
Invoke-Gcloud (@(
    "compute", "ssh", $SshTarget,
    "--zone", $Zone,
    "--command", "mkdir -p ~/vpngate-relay-setup"
) + $ProjectArgs)

$RemoteHome = Invoke-GcloudCapture (@(
    "compute", "ssh", $SshTarget,
    "--zone", $Zone,
    "--command", 'printf %s "$HOME"'
) + $ProjectArgs)

if (-not $RemoteHome) {
    throw "Could not determine remote home directory."
}

$RemoteSetupDir = "$RemoteHome/vpngate-relay-setup"
$RemoteInstallScript = "$RemoteSetupDir/install_vpngate_relay.sh"
$RemoteVpnGateConfig = "$RemoteSetupDir/vpngate.ovpn"
$RemoteClientConfig = "$RemoteHome/relay-client.ovpn"

if (-not $SkipUpload) {
    Write-Host "Uploading installer and VPN Gate config..."
    Upload-FileByChunksOverSsh -LocalPath $InstallScript -RemotePath $RemoteInstallScript -InstanceName $InstanceName -Zone $Zone -ProjectArgs $ProjectArgs
    Upload-FileByChunksOverSsh -LocalPath $VpnGateConfig -RemotePath $RemoteVpnGateConfig -InstanceName $InstanceName -Zone $Zone -ProjectArgs $ProjectArgs
}

Write-Host "Running remote installer. This can take a few minutes..."
$RemoteCommand = "chmod +x $RemoteInstallScript && sudo $RemoteInstallScript --server-port $ServerPort --server-proto $Protocol $RemoteVpnGateConfig"
Invoke-Gcloud (@(
    "compute", "ssh", $SshTarget,
    "--zone", $Zone,
    "--command", $RemoteCommand
) + $ProjectArgs)

$OutputDir = Join-Path $RepoRoot "gcp_relay_client"
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$ClientConfig = Join-Path $OutputDir "relay-client.ovpn"

Write-Host "Downloading client profile..."
Download-TextFileOverSsh -RemotePath $RemoteClientConfig -LocalPath $ClientConfig -InstanceName $InstanceName -Zone $Zone -ProjectArgs $ProjectArgs

Write-Host ""
Write-Host "Done."
Write-Host "Import this client profile into OpenVPN:"
Write-Host "  $ClientConfig"
Write-Host ""
Write-Host "Useful status command:"
Write-Host "  gcloud compute ssh $SshTarget --zone $Zone --command `"sudo systemctl status openvpn-server@relay openvpn-client@vpngate --no-pager`""

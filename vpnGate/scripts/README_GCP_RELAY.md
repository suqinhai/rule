# Google Cloud VPN Gate Relay

This setup creates a relay:

```text
your PC -> Google Cloud OpenVPN server -> VPN Gate OpenVPN client -> internet
```

It helps when your local network cannot fetch or connect to VPN Gate directly. It does not turn VPN Gate into a residential IP; the final exit IP is still the VPN Gate node.

## Prerequisites

- Google Cloud CLI installed locally.
- `gcloud auth login` completed.
- A Google Cloud project with Compute Engine enabled.
- At least one VPN Gate `.ovpn` file in `vpngate_ovpn_configs`.

## Deploy

From the project root on Windows PowerShell:

```powershell
.\scripts\deploy_gcp_vpngate_relay.ps1 -Project "your-gcp-project-id"
```

Optional parameters:

```powershell
.\scripts\deploy_gcp_vpngate_relay.ps1 `
  -Project "your-gcp-project-id" `
  -Zone "asia-northeast1-b" `
  -InstanceName "vpngate-relay" `
  -MachineType "e2-micro" `
  -VpnGateConfig "C:\Users\kpskp\Desktop\rule\vpnGate\vpngate_ovpn_configs\07_JP_60.137.146.81_ping15_score1460689.ovpn" `
  -ServerPort 1194
```

When the script finishes, import:

```text
gcp_relay_client\relay-client.ovpn
```

## Check status

```powershell
gcloud compute ssh vpngate-relay --zone asia-northeast1-b --command "sudo systemctl status openvpn-server@relay openvpn-client@vpngate --no-pager"
```

VPN Gate client logs:

```powershell
gcloud compute ssh vpngate-relay --zone asia-northeast1-b --command "sudo journalctl -u openvpn-client@vpngate -n 100 --no-pager"
```

## Important notes

- Google Cloud resources can incur charges.
- The VM uses an ephemeral external IP by default. If the VM external IP changes, rerun the deploy script to regenerate `relay-client.ovpn`.
- The firewall rule allows UDP `1194` from `0.0.0.0/0`. Restrict the source range if you know your client public IP.
- If the VPN Gate node dies, rerun the deploy script with a newer `-VpnGateConfig`.

## Clean up

```powershell
gcloud compute instances delete vpngate-relay --zone asia-northeast1-b
gcloud compute firewall-rules delete vpngate-relay-openvpn
```

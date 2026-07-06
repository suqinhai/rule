#!/usr/bin/env bash
set -euo pipefail

SERVER_PORT="1194"
SERVER_PROTO="udp"
VPNGATE_CONFIG=""
CLIENT_CIDR="10.8.0.0/24"
SERVER_NET="10.8.0.0"
SERVER_MASK="255.255.255.0"
RELAY_DEV="tun-relay"
VPNGATE_DEV="tun-vpngate"
POLICY_TABLE="100"
EASYRSA_DIR="/etc/openvpn/easy-rsa"
CLIENT_NAME="relay-client"

usage() {
  cat <<USAGE
Usage: sudo bash install_vpngate_relay.sh [--server-port 1194] /path/to/vpngate.ovpn
       sudo bash install_vpngate_relay.sh [--server-port 443] [--server-proto tcp] /path/to/vpngate.ovpn

Installs an OpenVPN relay on Debian/Ubuntu:
  local client -> this VM OpenVPN server -> VPN Gate OpenVPN client -> internet
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --server-port)
      SERVER_PORT="${2:-}"
      shift 2
      ;;
    --server-proto)
      SERVER_PROTO="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      VPNGATE_CONFIG="$1"
      shift
      ;;
  esac
done

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script with sudo/root." >&2
  exit 1
fi

if [[ -z "${VPNGATE_CONFIG}" || ! -f "${VPNGATE_CONFIG}" ]]; then
  echo "VPN Gate .ovpn file not found: ${VPNGATE_CONFIG}" >&2
  usage
  exit 1
fi

SERVER_PROTO="$(printf '%s' "${SERVER_PROTO}" | tr '[:upper:]' '[:lower:]')"
case "${SERVER_PROTO}" in
  udp|tcp) ;;
  *)
    echo "Invalid --server-proto '${SERVER_PROTO}'. Use udp or tcp." >&2
    exit 1
    ;;
esac

SERVER_CONF_PROTO="udp"
CLIENT_CONF_PROTO="udp"
EXPLICIT_EXIT_NOTIFY="explicit-exit-notify 1"
if [[ "${SERVER_PROTO}" == "tcp" ]]; then
  SERVER_CONF_PROTO="tcp-server"
  CLIENT_CONF_PROTO="tcp-client"
  EXPLICIT_EXIT_NOTIFY=""
fi

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y openvpn easy-rsa curl iptables ca-certificates

mkdir -p /etc/openvpn/server /etc/openvpn/client /var/log/openvpn

rm -rf "${EASYRSA_DIR}"
if command -v make-cadir >/dev/null 2>&1; then
  make-cadir "${EASYRSA_DIR}"
else
  cp -a /usr/share/easy-rsa "${EASYRSA_DIR}"
fi

cd "${EASYRSA_DIR}"
./easyrsa init-pki
EASYRSA_BATCH=1 ./easyrsa build-ca nopass
EASYRSA_BATCH=1 ./easyrsa gen-req server nopass
EASYRSA_BATCH=1 ./easyrsa sign-req server server
EASYRSA_BATCH=1 ./easyrsa gen-req "${CLIENT_NAME}" nopass
EASYRSA_BATCH=1 ./easyrsa sign-req client "${CLIENT_NAME}"
./easyrsa gen-dh

cp pki/ca.crt /etc/openvpn/server/ca.crt
cp pki/issued/server.crt /etc/openvpn/server/server.crt
cp pki/private/server.key /etc/openvpn/server/server.key
cp pki/dh.pem /etc/openvpn/server/dh.pem
openvpn --genkey secret /etc/openvpn/server/ta.key
chmod 600 /etc/openvpn/server/server.key /etc/openvpn/server/ta.key

cat >/etc/openvpn/server/relay.conf <<EOF
port ${SERVER_PORT}
proto ${SERVER_CONF_PROTO}
dev ${RELAY_DEV}
topology subnet
server ${SERVER_NET} ${SERVER_MASK}
ifconfig-pool-persist /var/log/openvpn/relay-ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 8.8.8.8"
keepalive 10 60
persist-key
persist-tun
user nobody
group nogroup
verb 3
${EXPLICIT_EXIT_NOTIFY}
status /var/log/openvpn/relay-status.log
ca ca.crt
cert server.crt
key server.key
dh dh.pem
tls-auth ta.key 0
auth SHA256
data-ciphers AES-256-GCM:AES-128-GCM:AES-128-CBC
cipher AES-256-GCM
EOF

cp "${VPNGATE_CONFIG}" /etc/openvpn/client/vpngate.conf
chmod 600 /etc/openvpn/client/vpngate.conf

sed -i -E 's/^[[:space:]]*dev[[:space:]]+.*/dev tun-vpngate/' /etc/openvpn/client/vpngate.conf
grep -Eq '^[[:space:]]*dev[[:space:]]+tun-vpngate[[:space:]]*$' /etc/openvpn/client/vpngate.conf || {
  printf '\ndev tun-vpngate\n' >>/etc/openvpn/client/vpngate.conf
}

sed -i -E 's/^([[:space:]]*)(redirect-gateway\b.*)$/;\1\2/' /etc/openvpn/client/vpngate.conf

append_if_missing() {
  local pattern="$1"
  local line="$2"
  grep -Eq "${pattern}" /etc/openvpn/client/vpngate.conf || printf '%s\n' "${line}" >>/etc/openvpn/client/vpngate.conf
}

append_if_missing '^[[:space:]]*route-nopull[[:space:]]*$' 'route-nopull'
append_if_missing '^[[:space:]]*pull-filter[[:space:]]+ignore[[:space:]]+redirect-gateway' 'pull-filter ignore redirect-gateway'
append_if_missing '^[[:space:]]*script-security[[:space:]]+2[[:space:]]*$' 'script-security 2'
append_if_missing '^[[:space:]]*up[[:space:]]+/usr/local/sbin/vpngate-relay-routes.sh' 'up /usr/local/sbin/vpngate-relay-routes.sh'
append_if_missing '^[[:space:]]*down[[:space:]]+/usr/local/sbin/vpngate-relay-routes.sh' 'down /usr/local/sbin/vpngate-relay-routes.sh'
append_if_missing '^[[:space:]]*down-pre[[:space:]]*$' 'down-pre'
append_if_missing '^[[:space:]]*auth-nocache[[:space:]]*$' 'auth-nocache'

cat >/usr/local/sbin/vpngate-relay-routes.sh <<EOF
#!/usr/bin/env bash
set -euo pipefail

ACTION="\${1:-\${script_type:-up}}"
CLIENT_CIDR="${CLIENT_CIDR}"
RELAY_DEV="${RELAY_DEV}"
VPNGATE_DEV="${VPNGATE_DEV}"
POLICY_TABLE="${POLICY_TABLE}"

case "\${ACTION}" in
  up|down) ;;
  *) ACTION="\${script_type:-up}" ;;
esac

add_rule() {
  iptables -C "\$@" 2>/dev/null || iptables -A "\$@"
}

add_nat_rule() {
  iptables -t nat -C "\$@" 2>/dev/null || iptables -t nat -A "\$@"
}

case "\${ACTION}" in
  up)
    sysctl -w net.ipv4.ip_forward=1 >/dev/null
    printf 'net.ipv4.ip_forward=1\n' >/etc/sysctl.d/99-vpngate-relay.conf

    ip rule show | grep -q "from \${CLIENT_CIDR} lookup \${POLICY_TABLE}" || \
      ip rule add from "\${CLIENT_CIDR}" table "\${POLICY_TABLE}"
    ip route replace default dev "\${VPNGATE_DEV}" table "\${POLICY_TABLE}"

    add_nat_rule POSTROUTING -s "\${CLIENT_CIDR}" -o "\${VPNGATE_DEV}" -j MASQUERADE
    add_rule FORWARD -i "\${RELAY_DEV}" -o "\${VPNGATE_DEV}" -s "\${CLIENT_CIDR}" -j ACCEPT
    add_rule FORWARD -i "\${VPNGATE_DEV}" -o "\${RELAY_DEV}" -d "\${CLIENT_CIDR}" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
    ;;
  down)
    ip route del default dev "\${VPNGATE_DEV}" table "\${POLICY_TABLE}" 2>/dev/null || true
    while ip rule del from "\${CLIENT_CIDR}" table "\${POLICY_TABLE}" 2>/dev/null; do true; done
    iptables -t nat -D POSTROUTING -s "\${CLIENT_CIDR}" -o "\${VPNGATE_DEV}" -j MASQUERADE 2>/dev/null || true
    iptables -D FORWARD -i "\${RELAY_DEV}" -o "\${VPNGATE_DEV}" -s "\${CLIENT_CIDR}" -j ACCEPT 2>/dev/null || true
    iptables -D FORWARD -i "\${VPNGATE_DEV}" -o "\${RELAY_DEV}" -d "\${CLIENT_CIDR}" -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 2>/dev/null || true
    ;;
esac
EOF
chmod +x /usr/local/sbin/vpngate-relay-routes.sh

PUBLIC_IP="$(curl -fsS -H 'Metadata-Flavor: Google' \
  http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip || true)"

if [[ -z "${PUBLIC_IP}" ]]; then
  PUBLIC_IP="$(curl -fsS https://api.ipify.org || true)"
fi

if [[ -z "${PUBLIC_IP}" ]]; then
  echo "Could not determine public IP for client config." >&2
  exit 1
fi

CLIENT_OVPN="/root/${CLIENT_NAME}.ovpn"
cat >"${CLIENT_OVPN}" <<EOF
client
dev tun
proto ${CLIENT_CONF_PROTO}
remote ${PUBLIC_IP} ${SERVER_PORT}
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
auth SHA256
data-ciphers AES-256-GCM:AES-128-GCM:AES-128-CBC
cipher AES-256-GCM
verb 3
key-direction 1
<ca>
$(cat /etc/openvpn/server/ca.crt)
</ca>
<cert>
$(cat "${EASYRSA_DIR}/pki/issued/${CLIENT_NAME}.crt")
</cert>
<key>
$(cat "${EASYRSA_DIR}/pki/private/${CLIENT_NAME}.key")
</key>
<tls-auth>
$(cat /etc/openvpn/server/ta.key)
</tls-auth>
EOF
chmod 600 "${CLIENT_OVPN}"

if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
  USER_HOME="$(getent passwd "${SUDO_USER}" | cut -d: -f6)"
  cp "${CLIENT_OVPN}" "${USER_HOME}/${CLIENT_NAME}.ovpn"
  chown "${SUDO_USER}:${SUDO_USER}" "${USER_HOME}/${CLIENT_NAME}.ovpn"
fi

systemctl daemon-reload
systemctl enable openvpn-server@relay openvpn-client@vpngate
systemctl restart openvpn-server@relay
systemctl restart openvpn-client@vpngate

echo
echo "OpenVPN relay installed."
echo "Server profile: /etc/openvpn/server/relay.conf"
echo "VPN Gate client profile: /etc/openvpn/client/vpngate.conf"
echo "Client profile: ${CLIENT_OVPN}"
echo
echo "Check status:"
echo "  sudo systemctl status openvpn-server@relay openvpn-client@vpngate --no-pager"
echo "  sudo journalctl -u openvpn-client@vpngate -n 100 --no-pager"

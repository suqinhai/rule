#!/usr/bin/env bash
# =============================================
# 记得 GCP 防火墙开放 UDP 51820
# WireGuard 多客户端一键脚本 - GCP 稳定版 v7
# 使用方法:
#   sudo bash install-wireguard-gcp.sh phone 1280
#   sudo bash install-wireguard-gcp.sh pc 1420
# =============================================

set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

WG_PORT="51820"
SERVER_WG_IP="10.66.66.1"
WG_SUBNET="10.66.66"
WG_DIR="/etc/wireguard"
CLIENT_DIR="${WG_DIR}/clients"
CLIENT_NAME="${1:-client1}"
CLIENT_MTU="${2:-1280}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print() { echo -e "${GREEN}[+]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

if [ "$(id -u)" -ne 0 ]; then
  error "请使用 root 执行：sudo bash $0 [客户端名称]"
fi

umask 077

print "开始安装/添加 WireGuard 客户端: ${CLIENT_NAME}"

print "安装必要软件..."
apt update -qq
apt install -y wireguard wireguard-tools qrencode iptables curl

mkdir -p "$WG_DIR" "$CLIENT_DIR"
chmod 700 "$WG_DIR" "$CLIENT_DIR"

print "识别服务器公网 IP..."
SERVER_PUBLIC_IP=$(curl -s -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip 2>/dev/null || true)

if [ -z "$SERVER_PUBLIC_IP" ]; then
  SERVER_PUBLIC_IP=$(curl -4 -s https://ifconfig.me || true)
fi

if [ -z "$SERVER_PUBLIC_IP" ]; then
  error "无法获取服务器公网 IP"
fi

print "服务器公网 IP: ${SERVER_PUBLIC_IP}"

print "识别默认网卡..."
DEFAULT_IFACE=$(ip -4 route show default | awk '{print $5}' | head -n1)

if [ -z "$DEFAULT_IFACE" ]; then
  error "无法识别默认网卡"
fi

print "默认网卡: ${DEFAULT_IFACE}"

if [ ! -f "$WG_DIR/server_private.key" ]; then
  print "首次初始化 WireGuard 服务端密钥..."
  wg genkey > "$WG_DIR/server_private.key"
  chmod 600 "$WG_DIR/server_private.key"
fi

SERVER_PRIVATE_KEY=$(cat "$WG_DIR/server_private.key")
SERVER_PUBLIC_KEY=$(echo "$SERVER_PRIVATE_KEY" | wg pubkey)

print "开启 IPv4 转发..."
cat > /etc/sysctl.d/99-wireguard.conf <<EOF
net.ipv4.ip_forward=1
net.ipv4.conf.all.forwarding=1
EOF
sysctl --system >/dev/null

CLIENT_KEY_FILE="${CLIENT_DIR}/${CLIENT_NAME}.private.key"
CLIENT_IP_FILE="${CLIENT_DIR}/${CLIENT_NAME}.ip"

if [ -f "$CLIENT_KEY_FILE" ]; then
  print "客户端 ${CLIENT_NAME} 已存在，使用已有密钥"
  CLIENT_PRIVATE_KEY=$(cat "$CLIENT_KEY_FILE")
else
  print "生成新客户端密钥..."
  CLIENT_PRIVATE_KEY=$(wg genkey)
  echo "$CLIENT_PRIVATE_KEY" > "$CLIENT_KEY_FILE"
  chmod 600 "$CLIENT_KEY_FILE"
fi

CLIENT_PUBLIC_KEY=$(echo "$CLIENT_PRIVATE_KEY" | wg pubkey)

if [ -f "$CLIENT_IP_FILE" ]; then
  CLIENT_WG_IP=$(cat "$CLIENT_IP_FILE")
  print "客户端 ${CLIENT_NAME} 使用已有 IP: ${CLIENT_WG_IP}"
else
  print "自动分配客户端 IP..."

  USED_IPS=""
  for ipfile in "$CLIENT_DIR"/*.ip; do
    [ -f "$ipfile" ] && USED_IPS="${USED_IPS} $(cat "$ipfile")"
  done

  CLIENT_WG_IP=""
  for i in $(seq 2 254); do
    candidate="${WG_SUBNET}.${i}"
    if ! echo "$USED_IPS" | grep -qw "$candidate"; then
      CLIENT_WG_IP="$candidate"
      break
    fi
  done

  if [ -z "$CLIENT_WG_IP" ]; then
    error "没有可用的客户端 IP"
  fi

  echo "$CLIENT_WG_IP" > "$CLIENT_IP_FILE"
  chmod 600 "$CLIENT_IP_FILE"
  print "分配 IP: ${CLIENT_WG_IP}"
fi

print "重建服务端配置..."

cat > "$WG_DIR/wg0.conf" <<WGCONF
[Interface]
Address = ${SERVER_WG_IP}/24
ListenPort = ${WG_PORT}
PrivateKey = ${SERVER_PRIVATE_KEY}

PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o ${DEFAULT_IFACE} -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ${DEFAULT_IFACE} -j MASQUERADE
WGCONF

for keyfile in "$CLIENT_DIR"/*.private.key; do
  [ -f "$keyfile" ] || continue

  name=$(basename "$keyfile" .private.key)
  ipfile="${CLIENT_DIR}/${name}.ip"

  if [ ! -f "$ipfile" ]; then
    warn "跳过 ${name}，因为没有 IP 文件"
    continue
  fi

  priv=$(cat "$keyfile")
  pub=$(echo "$priv" | wg pubkey)
  ip=$(cat "$ipfile")

  cat >> "$WG_DIR/wg0.conf" <<PEER

[Peer]
# ${name}
PublicKey = ${pub}
AllowedIPs = ${ip}/32
PEER
done

chmod 600 "$WG_DIR/wg0.conf"

CLIENT_CONF="${CLIENT_DIR}/${CLIENT_NAME}.conf"

cat > "$CLIENT_CONF" <<CLIENTCONF
[Interface]
PrivateKey = ${CLIENT_PRIVATE_KEY}
Address = ${CLIENT_WG_IP}/32
DNS = 1.1.1.1, 8.8.8.8
MTU = ${CLIENT_MTU}

[Peer]
PublicKey = ${SERVER_PUBLIC_KEY}
Endpoint = ${SERVER_PUBLIC_IP}:${WG_PORT}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
CLIENTCONF

chmod 600 "$CLIENT_CONF"
cp "$CLIENT_CONF" "/root/${CLIENT_NAME}.conf"
chmod 600 "/root/${CLIENT_NAME}.conf"

print "重启 WireGuard 服务..."
systemctl enable --now wg-quick@wg0 >/dev/null 2>&1
systemctl restart wg-quick@wg0

echo
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}客户端 ${CLIENT_NAME} 添加成功！${NC}"
echo -e "${GREEN}======================================${NC}"
echo "服务器公网 IP: ${SERVER_PUBLIC_IP}"
echo "客户端名称: ${CLIENT_NAME}"
echo "客户端内网 IP: ${CLIENT_WG_IP}"
echo "客户端配置路径: /root/${CLIENT_NAME}.conf"
echo "客户端 MTU: ${CLIENT_MTU}"
echo

echo -e "${GREEN}【可直接复制的配置】${NC}"
cat "/root/${CLIENT_NAME}.conf"
echo

echo -e "${GREEN}【手机扫码二维码】${NC}"
qrencode -t ansiutf8 -m 2 -s 2 < "/root/${CLIENT_NAME}.conf"

echo
echo -e "${YELLOW}添加新客户端示例：${NC}"
echo "sudo bash install-wireguard-gcp.sh phone"
echo "sudo bash install-wireguard-gcp.sh pc 1420"
echo

wg show
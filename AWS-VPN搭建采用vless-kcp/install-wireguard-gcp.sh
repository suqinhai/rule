#!/usr/bin/env bash
# =============================================
# 记得防火墙UDP开放51820端口
# WireGuard 一键安装脚本 - GCP 优化版 v4（手机扫码友好）
# 使用方法: sudo bash install-wireguard-gcp.sh [客户端名称]
# =============================================

set -euo pipefail

# ================== 配置参数 ==================
WG_PORT="51820"
WG_NET="10.66.66.0/24"
SERVER_WG_IP="10.66.66.1"
CLIENT_WG_IP="10.66.66.2"
CLIENT_NAME="${1:-client1}"
WG_DIR="/etc/wireguard"
CLIENT_DIR="${WG_DIR}/clients"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print() { echo -e "${GREEN}[+]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

umask 077

if [ "$(id -u)" -ne 0 ]; then
  error "请使用 root 执行：sudo bash $0 [客户端名称]"
fi

print "开始安装 WireGuard (GCP 优化版 v4)..."

apt update -qq
apt install -y wireguard qrencode iptables curl

# 获取公网 IP
print "获取服务器公网 IP..."
SERVER_PUBLIC_IP=$(curl -s -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip 2>/dev/null || true)

if [ -z "$SERVER_PUBLIC_IP" ]; then
  SERVER_PUBLIC_IP=$(curl -4 -s https://ifconfig.me || echo "")
fi
if [ -z "$SERVER_PUBLIC_IP" ]; then
  read -r -p "无法自动获取公网IP，请手动输入: " SERVER_PUBLIC_IP
fi

print "公网 IP: ${SERVER_PUBLIC_IP}"

DEFAULT_IFACE=$(ip -4 route show default | awk '{print $5}' | head -n1)
if [ -z "$DEFAULT_IFACE" ]; then
  error "无法识别默认网卡"
fi
print "默认网卡: ${DEFAULT_IFACE}"

# IP转发
cat > /etc/sysctl.d/99-wireguard.conf <<EOF
net.ipv4.ip_forward=1
net.ipv4.conf.all.forwarding=1
EOF
sysctl --system >/dev/null

mkdir -p "$WG_DIR" "$CLIENT_DIR"
chmod 700 "$WG_DIR" "$CLIENT_DIR"

# 服务端密钥
if [ ! -f "$WG_DIR/server_private.key" ]; then
  wg genkey > "$WG_DIR/server_private.key"
  chmod 600 "$WG_DIR/server_private.key"
fi
SERVER_PRIVATE_KEY=$(cat "$WG_DIR/server_private.key")
SERVER_PUBLIC_KEY=$(echo "$SERVER_PRIVATE_KEY" | wg pubkey)

# 客户端密钥
CLIENT_KEY_FILE="${CLIENT_DIR}/${CLIENT_NAME}.private.key"
if [ -f "$CLIENT_KEY_FILE" ]; then
  print "复用客户端 ${CLIENT_NAME}"
  CLIENT_PRIVATE_KEY=$(cat "$CLIENT_KEY_FILE")
else
  print "生成新客户端密钥..."
  CLIENT_PRIVATE_KEY=$(wg genkey)
  echo "$CLIENT_PRIVATE_KEY" > "$CLIENT_KEY_FILE"
  chmod 600 "$CLIENT_KEY_FILE"
fi
CLIENT_PUBLIC_KEY=$(echo "$CLIENT_PRIVATE_KEY" | wg pubkey)

# 服务端配置
cat > "$WG_DIR/wg0.conf" <<WGCONF
[Interface]
Address = ${SERVER_WG_IP}/24
ListenPort = ${WG_PORT}
PrivateKey = ${SERVER_PRIVATE_KEY}

PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o ${DEFAULT_IFACE} -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ${DEFAULT_IFACE} -j MASQUERADE

[Peer]
PublicKey = ${CLIENT_PUBLIC_KEY}
AllowedIPs = ${CLIENT_WG_IP}/32
WGCONF
chmod 600 "$WG_DIR/wg0.conf"

# 客户端配置
CLIENT_CONF="${CLIENT_DIR}/${CLIENT_NAME}.conf"
cat > "$CLIENT_CONF" <<CLIENTCONF
[Interface]
PrivateKey = ${CLIENT_PRIVATE_KEY}
Address = ${CLIENT_WG_IP}/32
DNS = 1.1.1.1,8.8.8.8
MTU = 1420

[Peer]
PublicKey = ${SERVER_PUBLIC_KEY}
Endpoint = ${SERVER_PUBLIC_IP}:${WG_PORT}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
CLIENTCONF

chmod 600 "$CLIENT_CONF"
cp "$CLIENT_CONF" "/root/${CLIENT_NAME}.conf"
chmod 600 "/root/${CLIENT_NAME}.conf"

# 启动服务
systemctl enable --now wg-quick@wg0 2>/dev/null || true
systemctl restart wg-quick@wg0

# ================== 输出结果 ==================
echo
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}WireGuard 安装成功！${NC}"
echo -e "${GREEN}======================================${NC}"
echo "公网 IP     : ${SERVER_PUBLIC_IP}"
echo "客户端名称  : ${CLIENT_NAME}"
echo

echo -e "${GREEN}【可直接复制的配置（PC推荐）】${NC}"
cat "/root/${CLIENT_NAME}.conf"
echo

echo -e "${GREEN}【手机扫码专用二维码】${NC}"
echo "（把手机摄像头对准下面方块扫码）"
qrencode -t ansiutf8 -m 2 -s 2 < "/root/${CLIENT_NAME}.conf"

echo -e "\n${YELLOW}如果扫码还是不清楚，可执行下面命令生成图片：${NC}"
echo "qrencode -t png -o /root/${CLIENT_NAME}.png < /root/${CLIENT_NAME}.conf"
echo "然后用 WinSCP 或 scp 把图片下载到手机扫码。"
echo
print "当前状态："
wg show
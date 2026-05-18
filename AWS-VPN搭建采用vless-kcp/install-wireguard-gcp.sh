#!/usr/bin/env bash
# =============================================
# 记得防火墙UDP开放51820端口
# WireGuard 多客户端一键脚本 - GCP 最终稳定版 v6
# 使用方法: sudo bash install-wireguard-gcp.sh [客户端名称]
# =============================================

set -euo pipefail

# ================== 参数 ==================
WG_PORT="51820"
SERVER_WG_IP="10.66.66.1"
WG_DIR="/etc/wireguard"
CLIENT_DIR="${WG_DIR}/clients"
CLIENT_NAME="${1:-client1}"

# 颜色
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

# ================== 安装依赖 ==================
print "安装必要软件..."
apt update -qq
apt install -y wireguard wireguard-tools qrencode iptables iptables-persistent curl

# ================== 首次初始化服务端 ==================
if [ ! -f "$WG_DIR/server_private.key" ]; then
    print "首次初始化 WireGuard 服务端..."
    
    SERVER_PUBLIC_IP=$(curl -s -H "Metadata-Flavor: Google" \
      http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip 2>/dev/null || curl -4 -s https://ifconfig.me)
    
    DEFAULT_IFACE=$(ip -4 route show default | awk '{print $5}' | head -n1)

    mkdir -p "$WG_DIR" "$CLIENT_DIR"
    chmod 700 "$WG_DIR" "$CLIENT_DIR"

    wg genkey > "$WG_DIR/server_private.key"
    chmod 600 "$WG_DIR/server_private.key"
    
    cat > /etc/sysctl.d/99-wireguard.conf <<EOF
net.ipv4.ip_forward=1
net.ipv4.conf.all.forwarding=1
EOF
    sysctl --system >/dev/null
fi

SERVER_PRIVATE_KEY=$(cat "$WG_DIR/server_private.key")
SERVER_PUBLIC_KEY=$(echo "$SERVER_PRIVATE_KEY" | wg pubkey)
SERVER_PUBLIC_IP=$(curl -s -H "Metadata-Flavor: Google" \
  http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip 2>/dev/null || curl -4 -s https://ifconfig.me)

# ================== 客户端密钥 ==================
CLIENT_KEY_FILE="${CLIENT_DIR}/${CLIENT_NAME}.private.key"
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

# 分配客户端 IP（避免冲突）
CLIENT_WG_IP="10.66.66.$(( 2 + $(echo "${CLIENT_NAME}" | cksum | cut -c1-4) % 250 ))"

# ================== 重建服务端配置（支持所有客户端） ==================
print "更新服务端配置（多客户端模式）..."

cat > "$WG_DIR/wg0.conf" <<WGCONF
[Interface]
Address = ${SERVER_WG_IP}/24
ListenPort = ${WG_PORT}
PrivateKey = ${SERVER_PRIVATE_KEY}

PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o ${DEFAULT_IFACE:-ens4} -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o ${DEFAULT_IFACE:-ens4} -j MASQUERADE
WGCONF

# 添加所有客户端
for keyfile in "$CLIENT_DIR"/*.private.key; do
    if [ -f "$keyfile" ]; then
        name=$(basename "$keyfile" .private.key)
        priv=$(cat "$keyfile")
        pub=$(echo "$priv" | wg pubkey)
        ip="10.66.66.$(( 2 + $(echo "${name}" | cksum | cut -c1-4) % 250 ))"
        cat >> "$WG_DIR/wg0.conf" <<PEER

[Peer]
# ${name}
PublicKey = ${pub}
AllowedIPs = ${ip}/32
PEER
    fi
done

chmod 600 "$WG_DIR/wg0.conf"

# ================== 生成客户端配置 ==================
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

# ================== 重启服务 ==================
print "重启 WireGuard 服务..."
systemctl enable --now wg-quick@wg0 >/dev/null 2>&1
systemctl restart wg-quick@wg0

# ================== 最终输出 ==================
echo
echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}客户端 ${CLIENT_NAME} 添加成功！${NC}"
echo -e "${GREEN}======================================${NC}"
echo "服务器公网IP: ${SERVER_PUBLIC_IP}"
echo "客户端配置路径: /root/${CLIENT_NAME}.conf"
echo

echo -e "${GREEN}【可直接复制的配置】${NC}"
cat "/root/${CLIENT_NAME}.conf"
echo

echo -e "${GREEN}【手机扫码二维码】${NC}"
qrencode -t ansiutf8 -m 2 -s 2 < "/root/${CLIENT_NAME}.conf"

echo -e "\n${YELLOW}提示：${NC}已支持多客户端，下次添加新客户端直接执行："
echo "sudo bash install-wireguard-gcp.sh 新名称"
echo
wg show
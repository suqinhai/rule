cat > install-vless-reality-optimized.sh <<'EOF'
#!/usr/bin/env bash
# =============================================
# VLESS + TCP + REALITY 优化安装脚本 - GCP/VPS 通用版
# 推荐系统：Debian 11/12, Ubuntu 20.04/22.04/24.04
# 使用方法：
#   sudo bash install-vless-reality-optimized.sh
# =============================================

set -euo pipefail

XRAY_BIN="/usr/local/bin/xray"
XRAY_DIR="/etc/xray"
XRAY_CONFIG="${XRAY_DIR}/config.json"
CLIENT_INFO="${XRAY_DIR}/client-info.txt"
SERVICE_FILE="/etc/systemd/system/xray.service"

PORT="443"
DEST_SERVER="www.microsoft.com"
DEST_PORT="443"
NODE_NAME="GCP-VLESS-REALITY"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print() { echo -e "${GREEN}[+]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

if [ "$(id -u)" -ne 0 ]; then
  error "请使用 root 权限运行：sudo bash $0"
fi

ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)
    XRAY_ZIP="Xray-linux-64.zip"
    ;;
  aarch64|arm64)
    XRAY_ZIP="Xray-linux-arm64-v8a.zip"
    ;;
  *)
    error "暂不支持的架构：$ARCH"
    ;;
esac

echo "========================================="
echo "  VLESS + TCP + REALITY 优化安装脚本"
echo "========================================="

print "安装依赖..."
apt update -y
apt install -y curl unzip jq openssl ca-certificates

print "下载并安装/更新 Xray..."
TMP_ZIP="/tmp/xray.zip"
curl -L --retry 3 --connect-timeout 10 -o "$TMP_ZIP" \
  "https://github.com/XTLS/Xray-core/releases/latest/download/${XRAY_ZIP}"

unzip -o "$TMP_ZIP" -d /usr/local/bin/
chmod +x "$XRAY_BIN"
rm -f "$TMP_ZIP"

if ! command -v xray >/dev/null 2>&1; then
  error "Xray 安装失败"
fi

print "Xray 版本："
"$XRAY_BIN" version | head -n 1 || true

mkdir -p "$XRAY_DIR"
chmod 700 "$XRAY_DIR"

print "生成 UUID..."
UUID="$(cat /proc/sys/kernel/random/uuid)"
echo "UUID: $UUID"

print "生成 REALITY 密钥对..."
KEYS="$("$XRAY_BIN" x25519 2>&1)"
echo "$KEYS"

PRIVATE_KEY="$(echo "$KEYS" | awk -F': ' '
/^PrivateKey:/ {print $2}
/^Private key:/ {print $2}
' | head -n1)"

PUBLIC_KEY="$(echo "$KEYS" | awk -F': ' '
/^Password \(PublicKey\):/ {print $2}
/^Password:/ {print $2}
/^PublicKey:/ {print $2}
/^Public key:/ {print $2}
' | head -n1)"

if [ -z "${PRIVATE_KEY}" ] || [ -z "${PUBLIC_KEY}" ]; then
  echo "$KEYS"
  error "REALITY 密钥生成失败"
fi

SHORT_ID="$(openssl rand -hex 8)"

print "获取服务器公网 IPv4..."
SERVER_IP="$(curl -4 -s --max-time 5 ifconfig.me || true)"
if [ -z "$SERVER_IP" ]; then
  SERVER_IP="$(curl -4 -s --max-time 5 ip.sb || true)"
fi
if [ -z "$SERVER_IP" ]; then
  SERVER_IP="$(curl -4 -s --max-time 5 ipinfo.io/ip || true)"
fi
if [ -z "$SERVER_IP" ]; then
  warn "自动获取公网 IP 失败，请安装完成后手动替换客户端地址"
  SERVER_IP="YOUR_SERVER_IP"
fi

print "写入 Xray 配置..."
cat > "$XRAY_CONFIG" <<EOF_CONFIG
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "tag": "vless-reality-in",
      "listen": "0.0.0.0",
      "port": ${PORT},
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "${UUID}",
            "flow": "xtls-rprx-vision",
            "email": "user@reality"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "sockopt": {
          "tcpFastOpen": true,
          "tcpKeepAliveInterval": 30,
          "tcpNoDelay": true
        },
        "realitySettings": {
          "show": false,
          "dest": "${DEST_SERVER}:${DEST_PORT}",
          "xver": 0,
          "serverNames": [
            "${DEST_SERVER}",
            "microsoft.com"
          ],
          "privateKey": "${PRIVATE_KEY}",
          "shortIds": [
            "${SHORT_ID}"
          ]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls",
          "quic"
        ],
        "routeOnly": false
      }
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom"
    },
    {
      "tag": "block",
      "protocol": "blackhole"
    }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "protocol": [
          "bittorrent"
        ],
        "outboundTag": "block"
      }
    ]
  }
}
EOF_CONFIG

chmod 600 "$XRAY_CONFIG"

print "验证 Xray 配置..."
if ! "$XRAY_BIN" -test -config "$XRAY_CONFIG"; then
  cat "$XRAY_CONFIG"
  error "Xray 配置验证失败"
fi

print "优化系统网络参数..."
cat > /etc/sysctl.d/99-xray-optimized.conf <<'EOF_SYSCTL'
# Queue / BBR
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr

# TCP buffer
net.core.rmem_max=67108864
net.core.wmem_max=67108864
net.ipv4.tcp_rmem=4096 87380 67108864
net.ipv4.tcp_wmem=4096 65536 67108864

# TCP optimization
net.ipv4.tcp_fastopen=3
net.ipv4.tcp_mtu_probing=1
net.ipv4.tcp_slow_start_after_idle=0

# Keepalive
net.ipv4.tcp_keepalive_time=600
net.ipv4.tcp_keepalive_intvl=30
net.ipv4.tcp_keepalive_probes=5

# Connection queue
net.core.somaxconn=65535
net.ipv4.tcp_max_syn_backlog=65535
net.ipv4.ip_local_port_range=1024 65535
EOF_SYSCTL

sysctl --system >/dev/null 2>&1 || true

print "当前 TCP 拥塞控制算法："
sysctl net.ipv4.tcp_congestion_control || true

if sysctl net.ipv4.tcp_available_congestion_control 2>/dev/null | grep -q bbr; then
  print "BBR 可用"
else
  warn "当前内核可能不支持 BBR，建议使用 Debian 11/12 或 Ubuntu 20.04+"
fi

print "创建 systemd 服务..."
cat > "$SERVICE_FILE" <<EOF_SERVICE
[Unit]
Description=Xray Service
Documentation=https://github.com/XTLS/Xray-core
After=network-online.target nss-lookup.target
Wants=network-online.target

[Service]
Type=simple
User=root
ExecStart=${XRAY_BIN} -config ${XRAY_CONFIG}
Restart=always
RestartSec=3
LimitNOFILE=1048576
LimitNPROC=1048576
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF_SERVICE

print "尝试开放防火墙端口..."
if command -v ufw >/dev/null 2>&1; then
  ufw allow "${PORT}/tcp" >/dev/null 2>&1 || true
fi

setup_gcp_firewall() {
  local metadata_url="http://metadata.google.internal/computeMetadata/v1"
  local metadata_header="Metadata-Flavor: Google"
  local project_id=""
  local network_url=""
  local network_name=""
  local rule_name="allow-xray-reality-${PORT}-tcp"
  local token=""
  local body=""

  if ! curl -fsS --connect-timeout 1 -H "${metadata_header}" \
    "${metadata_url}/project/project-id" >/dev/null 2>&1; then
    warn "Not running on GCP metadata server; skip cloud firewall rule"
    return 0
  fi

  project_id="$(curl -fsS -H "${metadata_header}" "${metadata_url}/project/project-id" 2>/dev/null || true)"
  network_url="$(curl -fsS -H "${metadata_header}" "${metadata_url}/instance/network-interfaces/0/network" 2>/dev/null || true)"
  network_name="${network_url##*/}"

  if [ -z "${project_id}" ] || [ -z "${network_name}" ]; then
    warn "Unable to detect GCP project/network; create tcp:${PORT} firewall rule manually"
    return 0
  fi

  print "Creating/checking GCP firewall rule: ${rule_name}"

  if command -v gcloud >/dev/null 2>&1; then
    if gcloud compute firewall-rules describe "${rule_name}" \
      --project="${project_id}" >/dev/null 2>&1; then
      print "GCP firewall rule already exists: ${rule_name}"
      return 0
    fi

    if gcloud compute firewall-rules create "${rule_name}" \
      --project="${project_id}" \
      --network="${network_name}" \
      --direction=INGRESS \
      --priority=1000 \
      --action=ALLOW \
      --rules="tcp:${PORT}" \
      --source-ranges="0.0.0.0/0" \
      --description="Allow inbound tcp:${PORT} for Xray VLESS REALITY" >/dev/null 2>&1; then
      print "GCP firewall rule created: ${rule_name}"
      return 0
    fi

    warn "gcloud failed to create firewall rule; trying Compute API fallback"
  else
    warn "gcloud not found; trying Compute API fallback"
  fi

  token="$(curl -fsS -H "${metadata_header}" \
    "${metadata_url}/instance/service-accounts/default/token" 2>/dev/null | jq -r '.access_token // empty' 2>/dev/null || true)"

  if [ -z "${token}" ]; then
    warn "Unable to get GCP access token; create tcp:${PORT} firewall rule manually"
    return 0
  fi

  if curl -fsS -H "Authorization: Bearer ${token}" \
    "https://compute.googleapis.com/compute/v1/projects/${project_id}/global/firewalls/${rule_name}" >/dev/null 2>&1; then
    print "GCP firewall rule already exists: ${rule_name}"
    return 0
  fi

  body="$(jq -n \
    --arg name "${rule_name}" \
    --arg network "https://www.googleapis.com/compute/v1/projects/${project_id}/global/networks/${network_name}" \
    --arg port "${PORT}" \
    '{
      name: $name,
      network: $network,
      direction: "INGRESS",
      priority: 1000,
      allowed: [{IPProtocol: "tcp", ports: [$port]}],
      sourceRanges: ["0.0.0.0/0"],
      description: ("Allow inbound tcp:" + $port + " for Xray VLESS REALITY")
    }')"

  if curl -fsS -X POST \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -d "${body}" \
    "https://compute.googleapis.com/compute/v1/projects/${project_id}/global/firewalls" >/dev/null 2>&1; then
    print "GCP firewall rule created: ${rule_name}"
  else
    warn "Failed to create GCP firewall rule automatically"
    warn "Manual command:"
    echo "gcloud compute firewall-rules create ${rule_name} --project=${project_id} --network=${network_name} --direction=INGRESS --action=ALLOW --rules=tcp:${PORT} --source-ranges=0.0.0.0/0"
  fi
}

setup_gcp_firewall

print "启动 Xray..."
systemctl daemon-reload
systemctl enable xray >/dev/null 2>&1
systemctl restart xray

sleep 2

if ! systemctl is-active --quiet xray; then
  journalctl -u xray -n 50 --no-pager
  error "Xray 启动失败"
fi

CLIENT_URL="vless://${UUID}@${SERVER_IP}:${PORT}?encryption=none&flow=xtls-rprx-vision&security=reality&sni=${DEST_SERVER}&fp=chrome&pbk=${PUBLIC_KEY}&sid=${SHORT_ID}&type=tcp&headerType=none#${NODE_NAME}"

cat > "$CLIENT_INFO" <<EOF_INFO
========================================
VLESS + TCP + REALITY 客户端信息
========================================

地址: ${SERVER_IP}
端口: ${PORT}
UUID: ${UUID}
协议: VLESS
传输: TCP
安全: REALITY
Flow: xtls-rprx-vision
SNI: ${DEST_SERVER}
Fingerprint: chrome
Public Key: ${PUBLIC_KEY}
Short ID: ${SHORT_ID}

客户端链接:
${CLIENT_URL}

========================================
常用检查命令：

查看 Xray 状态：
systemctl status xray --no-pager

查看 Xray 日志：
journalctl -u xray -f

查看 BBR：
sysctl net.ipv4.tcp_congestion_control

查看配置：
cat /etc/xray/client-info.txt
========================================
EOF_INFO

chmod 600 "$CLIENT_INFO"

echo ""
echo "========================================="
echo "  安装完成"
echo "========================================="
echo ""
echo "服务器 IP: ${SERVER_IP}"
echo "端口: ${PORT}"
echo "UUID: ${UUID}"
echo "Public Key: ${PUBLIC_KEY}"
echo "Short ID: ${SHORT_ID}"
echo "SNI: ${DEST_SERVER}"
echo ""
echo "========================================="
echo "  客户端链接"
echo "========================================="
echo ""
echo "${CLIENT_URL}"
echo ""
echo "配置信息已保存到：${CLIENT_INFO}"
echo ""
EOF

sudo bash install-vless-reality-optimized.sh

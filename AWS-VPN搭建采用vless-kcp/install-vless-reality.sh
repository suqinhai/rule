#!/bin/bash

# VLESS + TCP + REALITY 安装脚本
# 优点：不需要域名、高性能、TCP不易被限速、安全性高

set -e

echo "========================================="
echo "  VLESS + REALITY 安装脚本"
echo "========================================="

# 更新系统并安装依赖
echo "[1/6] 更新系统..."
apt update -y && apt upgrade -y
apt install -y curl unzip jq

# 下载并安装 XRay
echo "[2/6] 安装 XRay..."
if [ ! -f /usr/local/bin/xray ]; then
    curl -L -o xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip
    unzip -o xray.zip -d /usr/local/bin/
    chmod +x /usr/local/bin/xray
    rm xray.zip
else
    echo "XRay 已存在，跳过安装"
fi

# 创建配置文件目录
mkdir -p /etc/xray

# 生成 UUID
UUID=$(cat /proc/sys/kernel/random/uuid)
echo "[3/6] 生成 UUID: $UUID"

# 生成 REALITY 密钥对
echo "[4/6] 生成 REALITY 密钥对..."
KEYS=$(/usr/local/bin/xray x25519)
PRIVATE_KEY=$(echo "$KEYS" | grep "Private key:" | awk '{print $3}')
PUBLIC_KEY=$(echo "$KEYS" | grep "Public key:" | awk '{print $3}')
echo "Private Key: $PRIVATE_KEY"
echo "Public Key: $PUBLIC_KEY"

# 生成 Short ID (8位十六进制)
SHORT_ID=$(openssl rand -hex 8)
echo "Short ID: $SHORT_ID"

# 获取服务器 IP
SERVER_IP=$(curl -s ifconfig.me)
echo "服务器 IP: $SERVER_IP"

# 目标伪装网站（使用大型网站）
DEST_SERVER="www.microsoft.com"
DEST_PORT=443

# 创建服务器配置文件
echo "[5/6] 创建配置文件..."
cat << EOF > /etc/xray/config.json
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "listen": "0.0.0.0",
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "$UUID",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": false,
          "dest": "${DEST_SERVER}:${DEST_PORT}",
          "xver": 0,
          "serverNames": [
            "$DEST_SERVER",
            "microsoft.com"
          ],
          "privateKey": "$PRIVATE_KEY",
          "shortIds": [
            "$SHORT_ID"
          ]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "tag": "block"
    }
  ]
}
EOF

# 创建 systemd 服务
cat << EOF > /etc/systemd/system/xray.service
[Unit]
Description=Xray Service
After=network.target

[Service]
ExecStart=/usr/local/bin/xray -config /etc/xray/config.json
Restart=always
RestartSec=3
User=root
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

# 优化系统网络参数
echo "[*] 优化系统网络参数..."
cat << EOF > /etc/sysctl.d/99-xray.conf
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_rmem=4096 87380 16777216
net.ipv4.tcp_wmem=4096 65536 16777216
net.ipv4.tcp_congestion_control=bbr
net.core.default_qdisc=fq
net.ipv4.tcp_fastopen=3
EOF
sysctl -p /etc/sysctl.d/99-xray.conf 2>/dev/null || true

# 启动服务
echo "[6/6] 启动服务..."
systemctl daemon-reload
systemctl enable xray
systemctl restart xray
sleep 2
systemctl status xray --no-pager

# 生成客户端配置链接
CLIENT_URL="vless://${UUID}@${SERVER_IP}:443?encryption=none&flow=xtls-rprx-vision&security=reality&sni=${DEST_SERVER}&fp=chrome&pbk=${PUBLIC_KEY}&sid=${SHORT_ID}&type=tcp&headerType=none#GCP-VLESS-REALITY"

echo ""
echo "========================================="
echo "  安装完成!"
echo "========================================="
echo ""
echo "服务器 IP: $SERVER_IP"
echo "端口: 443"
echo "UUID: $UUID"
echo "Public Key: $PUBLIC_KEY"
echo "Short ID: $SHORT_ID"
echo "SNI: $DEST_SERVER"
echo ""
echo "========================================="
echo "  客户端配置链接 (复制到 V2rayN/Clash 导入)"
echo "========================================="
echo ""
echo "$CLIENT_URL"
echo ""

# 保存配置信息
cat << EOF > /etc/xray/client-info.txt
========================================
VLESS + REALITY 客户端配置信息
========================================
服务器: $SERVER_IP
端口: 443
UUID: $UUID
Flow: xtls-rprx-vision
Security: reality
SNI: $DEST_SERVER
Fingerprint: chrome
Public Key: $PUBLIC_KEY
Short ID: $SHORT_ID

客户端链接:
$CLIENT_URL
========================================
EOF

echo "配置信息已保存到: /etc/xray/client-info.txt"

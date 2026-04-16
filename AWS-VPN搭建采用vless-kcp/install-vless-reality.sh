#!/bin/bash

# VLESS + TCP + REALITY 安装脚本
# 优点：不需要域名、高性能、TCP不易被限速、安全性高

# VLESS + TCP + REALITY 安装脚本
# 优点：不需要域名、高性能、TCP不易被限速、安全性高
#
# 两个脚本对比
# | 特性       | install-vless-vpn.sh (原) | install-vless-reality.sh (新) |
# |------------|---------------------------|-------------------------------|
# | 协议       | VLESS + mKCP (UDP)        | VLESS + TCP + REALITY         |
# | 端口       | 25642                     | 443                           |
# | 需要域名   | 否                        | 否                            |
# | 抗封锁     | 一般                      | 强（伪装成访问微软）          |
# | 带宽利用率 | 较低（UDP开销大）         | 高（TCP协议）                 |
# | 抗丢包     | 好                        | 一般                          |
# | 被限速风险 | 高（UDP易被QoS）          | 低（TCP+443端口）             |

set -e

# 检查 root 权限
if [ "$EUID" -ne 0 ]; then
    echo "请使用 root 权限运行此脚本: sudo $0"
    exit 1
fi

echo "========================================="
echo "  VLESS + REALITY 安装脚本"
echo "========================================="

# 更新系统并安装依赖
echo "[1/6] 更新系统..."
apt update -y && apt upgrade -y
apt install -y curl unzip jq openssl

# 下载并安装 XRay
echo "[2/6] 安装 XRay..."
if [ ! -f /usr/local/bin/xray ]; then
    curl -L -o /tmp/xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip
    unzip -o /tmp/xray.zip -d /usr/local/bin/
    chmod +x /usr/local/bin/xray
    rm -f /tmp/xray.zip
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
KEYS=$(/usr/local/bin/xray x25519 2>&1)
echo "$KEYS"

# 兼容不同版本 xray x25519 输出
PRIVATE_KEY=$(echo "$KEYS" | awk -F': ' '
/^PrivateKey:/ {print $2}
/^Private key:/ {print $2}
' | head -n1)

PUBLIC_KEY=$(echo "$KEYS" | awk -F': ' '
/^Password \(PublicKey\):/ {print $2}
/^Password:/ {print $2}
/^PublicKey:/ {print $2}
/^Public key:/ {print $2}
' | head -n1)

HASH32=$(echo "$KEYS" | awk -F': ' '
/^Hash32:/ {print $2}
' | head -n1)

# 验证密钥是否生成成功
if [ -z "$PRIVATE_KEY" ] || [ -z "$PUBLIC_KEY" ]; then
    echo "错误：密钥生成失败，xray x25519 输出："
    echo "$KEYS"
    exit 1
fi

echo "Private Key: $PRIVATE_KEY"
echo "Public Key: $PUBLIC_KEY"
[ -n "$HASH32" ] && echo "Hash32: $HASH32"

# 生成 Short ID (8位十六进制)
SHORT_ID=$(openssl rand -hex 8)
echo "Short ID: $SHORT_ID"

# 获取服务器 IP
SERVER_IP=$(curl -4 -s ifconfig.me || curl -4 -s ip.sb || curl -4 -s ipinfo.io/ip)
echo "服务器 IP: $SERVER_IP"

# 目标伪装网站
DEST_SERVER="www.microsoft.com"
DEST_PORT=443

# 创建服务器配置文件
echo "[5/6] 创建配置文件..."
cat > /etc/xray/config.json << EOF
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
            "id": "${UUID}",
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

# 验证配置文件
echo "验证配置文件..."
if ! /usr/local/bin/xray -test -config /etc/xray/config.json; then
    echo "配置文件验证失败！"
    cat /etc/xray/config.json
    exit 1
fi
echo "配置文件验证通过"

# 创建 systemd 服务
cat > /etc/systemd/system/xray.service << EOF
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
cat > /etc/sysctl.d/99-xray.conf << EOF
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

# 检查服务状态
if systemctl is-active --quiet xray; then
    echo "XRay 服务启动成功！"
else
    echo "XRay 服务启动失败，查看日志："
    journalctl -u xray -n 20 --no-pager
    exit 1
fi

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
cat > /etc/xray/client-info.txt << EOF
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
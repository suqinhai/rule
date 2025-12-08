#!/bin/bash

# 更新系统并安装依赖
echo "更新系统..."
apt update -y && apt upgrade -y
apt install -y curl unzip jq

# 下载并安装 XRay
echo "安装 XRay..."
curl -L -o xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip
unzip xray.zip -d /usr/local/bin/
chmod +x /usr/local/bin/xray
rm xray.zip

# 创建配置文件目录
mkdir -p /etc/xray

# 生成 UUID（用户 ID）
UUID=$(cat /proc/sys/kernel/random/uuid)
echo "生成的 UUID: $UUID"

# 创建服务器配置文件（VLESS + KCP，高带宽优化，无加密以最大速度）
cat << EOF > /etc/xray/config.json
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "port": 25642,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "$UUID"
          }
        ],
        "decryption": "none"  // 无解密，减少开销
      },
      "streamSettings": {
        "network": "kcp",
        "kcpSettings": {
          "mtu": 1350,
          "tti": 20,
          "uplinkCapacity": 2500,   // 高上行容量，拉满带宽
          "downlinkCapacity": 2500, // 高下行容量
          "congestion": true,      // 启用拥塞控制
          "readBufferSize": 16,    // 大读取缓冲
          "writeBufferSize": 16,   // 大写入缓冲
          "header": {
            "type": "none"         // 无伪装，最大速度（可改 dtls）
          }
        },
        "security": "none"         // 无 TLS，纯速度（若需安全，改 reality 并配置域名）
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
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
User=root

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl enable xray
systemctl start xray
systemctl status xray --no-pager

# 生成客户端配置 JSON（VLESS URL 格式）
CLIENT_CONFIG="vless://$UUID@$(curl -s ifconfig.me):25642?type=kcp&headerType=none&security=none#AWS-VLESS-MaxBandwidth"

echo "客户端配置（复制到 V2Ray 客户端导入）："
echo $CLIENT_CONFIG

# 保存到文件
echo $CLIENT_CONFIG > /etc/xray/client-config.txt
echo "客户端配置已保存到 /etc/xray/client-config.txt"
echo "安装完成！服务器 IP: $(curl -s ifconfig.me)，端口: 25642"

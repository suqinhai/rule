import requests
import csv
import subprocess
import time
import base64
import re
import os
import platform
from io import StringIO
from typing import List, Dict


API_URL = "https://www.vpngate.net/api/iphone/"
OUTPUT_DIR = "vpngate_ovpn_configs"

# 想生成几个配置文件
GENERATE_TOP_N = 10

# 国家筛选，不限制就填 None
# 例如只要日本：COUNTRY_FILTER = "Japan"
# 例如只要美国：COUNTRY_FILTER = "United States"
COUNTRY_FILTER = None


def fetch_vpngate_servers():
    """获取 VPN Gate 服务器列表"""
    try:
        response = requests.get(API_URL, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"获取列表失败: {e}")
        return None


def safe_filename(name: str) -> str:
    """生成安全文件名"""
    name = re.sub(r'[\\/:*?"<>|]', "_", name)
    name = re.sub(r"\s+", "_", name)
    return name[:120]


def parse_servers(data: str) -> List[Dict]:
    """解析 VPN Gate CSV 数据"""
    servers = []

    # VPN Gate 最后一行可能是 *，需要过滤
    lines = [line for line in data.splitlines() if line and not line.startswith("*")]

    if not lines:
        return servers

    reader = csv.reader(lines)

    # 第一行是表头
    headers = next(reader, None)

    for row in reader:
        # VPN Gate API 通常至少 15 列，最后一列是 OpenVPN 配置 base64
        if len(row) < 15:
            continue

        try:
            openvpn_base64 = row[14]

            if not openvpn_base64:
                continue

            server = {
                "hostname": row[0],
                "ip": row[1],
                "score": int(row[2]),
                "ping": int(row[3]),
                "speed": int(row[4]),
                "country_long": row[5],
                "country_short": row[6],
                "sessions": int(row[7]),
                "uptime_days": round(int(row[8]) / 86400, 1),
                "total_users": int(row[9]),
                "total_traffic": int(row[10]),
                "log_type": row[11],
                "operator": row[12],
                "message": row[13],
                "openvpn_config_base64": openvpn_base64,
            }

            servers.append(server)
        except Exception:
            continue

    return servers


def ping_test(ip: str, timeout=2) -> bool:
    """Ping 测试 IP 是否可达，不可达不代表 OpenVPN 不能用"""
    try:
        system_name = platform.system().lower()

        if "windows" in system_name:
            cmd = ["ping", "-n", "1", "-w", str(timeout * 1000), ip]
        else:
            cmd = ["ping", "-c", "1", "-W", str(timeout), ip]

        output = subprocess.check_output(
            cmd,
            stderr=subprocess.STDOUT,
            timeout=timeout + 2
        ).decode("utf-8", errors="ignore")

        return "ttl=" in output.lower() or "bytes from" in output.lower()
    except Exception:
        return False


def decode_openvpn_config(config_base64: str) -> str:
    """解码 VPN Gate 返回的 OpenVPN 配置"""
    try:
        # 有些 base64 可能缺 padding，补齐
        missing_padding = len(config_base64) % 4
        if missing_padding:
            config_base64 += "=" * (4 - missing_padding)

        decoded = base64.b64decode(config_base64)
        return decoded.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"解码 OpenVPN 配置失败: {e}")
        return ""


def save_ovpn_config(server: Dict, index: int) -> str:
    """保存单个 .ovpn 配置文件"""
    config_text = decode_openvpn_config(server["openvpn_config_base64"])

    if not config_text.strip():
        return ""

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    filename = safe_filename(
        f"{index:02d}_{server['country_short']}_{server['ip']}_ping{server['ping']}_score{server['score']}.ovpn"
    )

    filepath = os.path.join(OUTPUT_DIR, filename)

    with open(filepath, "w", encoding="utf-8", newline="\n") as f:
        f.write(config_text)

    return filepath


def main():
    print("正在获取 VPN Gate 服务器列表...")
    data = fetch_vpngate_servers()

    if not data:
        return

    servers = parse_servers(data)
    print(f"共获取 {len(servers)} 个服务器")

    filtered = [
        s for s in servers
        if s["ping"] > 0
        and s["ping"] < 150
        and s["score"] > 500000
        and s["uptime_days"] > 1
        and s["speed"] > 10000000
        and s.get("openvpn_config_base64")
    ]

    if COUNTRY_FILTER:
        filtered = [
            s for s in filtered
            if s["country_long"].lower() == COUNTRY_FILTER.lower()
        ]

    filtered.sort(key=lambda x: x["score"], reverse=True)

    if not filtered:
        print("没有筛选到合适服务器，可以放宽筛选条件。")
        return

    print(f"\n筛选后剩余 {len(filtered)} 个优质服务器，前 {GENERATE_TOP_N} 个如下：")

    for i, s in enumerate(filtered[:GENERATE_TOP_N], 1):
        print(
            f"{i:2d}. {s['country_long']} ({s['ip']}) | "
            f"Ping:{s['ping']}ms | "
            f"Speed:{s['speed'] // 1000000}Mbps | "
            f"Uptime:{s['uptime_days']}天 | "
            f"Score:{s['score']}"
        )

    print(f"\n正在生成前 {GENERATE_TOP_N} 个 .ovpn 配置文件...")

    saved_files = []

    for i, server in enumerate(filtered[:GENERATE_TOP_N], 1):
        filepath = save_ovpn_config(server, i)
        if filepath:
            saved_files.append(filepath)
            print(f"✅ 已生成: {filepath}")
        else:
            print(f"❌ 生成失败: {server['ip']}")

    print("\n正在 Ping 测试前 5 个服务器...")
    for s in filtered[:5]:
        print(f"测试 {s['ip']} ... ", end="")
        if ping_test(s["ip"]):
            print("✅ 可达")
        else:
            print("❌ 可能不可达")
        time.sleep(1)

    csv_path = "vpngate_good_servers.csv"

    csv_fields = [
        "hostname",
        "ip",
        "score",
        "ping",
        "speed",
        "country_long",
        "country_short",
        "sessions",
        "uptime_days",
        "total_users",
        "total_traffic",
        "log_type",
        "operator",
        "message",
    ]

    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields)
        writer.writeheader()

        for s in filtered:
            row = {k: s.get(k, "") for k in csv_fields}
            writer.writerow(row)

    print(f"\n已保存服务器列表到: {csv_path}")

    print("\n生成完成。")
    print(f"配置文件目录: {OUTPUT_DIR}")

    print("\n下一步：")
    print("1. 打开 OpenVPN GUI")
    print("2. 右键图标")
    print("3. 导入 → 导入配置文件")
    print(f"4. 选择 {OUTPUT_DIR} 里面的 .ovpn 文件")
    print("5. 连接")


if __name__ == "__main__":
    main()
import requests
import argparse
import csv
import subprocess
import time
import base64
import re
import os
import platform
import shutil
import threading
from io import StringIO
from typing import List, Dict


API_URL = "https://www.vpngate.net/api/iphone/"
OUTPUT_DIR = "vpngate_ovpn_configs"

# 想生成几个配置文件
GENERATE_TOP_N = 50

# 国家筛选，不限制就填 None
# 例如只要日本：COUNTRY_FILTER = "Japan"
# 例如只要美国：COUNTRY_FILTER = "United States"
COUNTRY_FILTER = None

# 本地 IP 质量过滤。只能排除明显的公共 VPN/机房特征，不能保证剩下的是住宅 IP。
ENABLE_LOCAL_IP_QUALITY_FILTER = True

# 明显不是住宅出口的已知网段前缀。
BLOCKED_IP_PREFIXES = [
    "219.100.37.",
]

# 在 hostname/operator/message 里命中这些关键词时跳过。
BLOCKED_TEXT_KEYWORDS = [
    "softether",
    "vpngate",
    "vpn gate",
    "public-vpn",
    "public vpn",
    "opengw",
    "open.ad.jp",
    "academic use only",
    "university",
    "datacenter",
    "data center",
    "hosting",
    "cloud",
    "colo",
]

# 是否调用本机 OpenVPN 客户端真实连接测试。
# 开启后，只有连接日志出现 Initialization Sequence Completed 的配置才会保留。
VERIFY_WITH_OPENVPN_CLIENT = True

# 如果 openvpn 不在 PATH，可以手动填写，例如：
# OPENVPN_EXE = r"C:\Program Files\OpenVPN\bin\openvpn.exe"
OPENVPN_EXE = r"C:\Program Files\OpenVPN\bin\openvpn.exe"

# 单个节点最多测试多少秒。VPN Gate 节点经常失效，建议不要设太长。
OPENVPN_TEST_TIMEOUT = 45

# 测试连接时尽量避免修改默认路由；仍然需要本机 OpenVPN/TAP/Wintun 可正常工作。
OPENVPN_TEST_ARGS = [
    "--connect-timeout", "10",
    "--connect-retry-max", "1",
    "--route-noexec",
    "--pull-filter", "ignore", "redirect-gateway",
    "--auth-nocache",
]

OPENVPN_SUCCESS_TEXT = "Initialization Sequence Completed"
OPENVPN_FAILURE_TEXTS = [
    "AUTH_FAILED",
    "TLS Error",
    "TLS key negotiation failed",
    "Connection timed out",
    "Connection refused",
    "Connection reset",
    "Cannot open TUN/TAP dev",
    "All TAP-Windows adapters",
    "Exiting due to fatal error",
    "Options error",
    "RESOLVE: Cannot resolve host address",
]

CSV_FIELDS = [
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


def local_ip_quality_filter_reason(server: Dict) -> str:
    """返回本地质量过滤原因；空字符串表示通过。"""
    ip = str(server.get("ip", ""))

    for prefix in BLOCKED_IP_PREFIXES:
        if ip.startswith(prefix):
            return f"命中已知公共 VPN/机房网段 {prefix}*"

    text_fields = [
        server.get("hostname", ""),
        server.get("operator", ""),
        server.get("message", ""),
    ]
    combined_text = " ".join(str(value) for value in text_fields).lower()

    for keyword in BLOCKED_TEXT_KEYWORDS:
        if keyword.lower() in combined_text:
            return f"命中公共 VPN/机房关键词: {keyword}"

    return ""


def apply_local_ip_quality_filter(servers: List[Dict]):
    """过滤明显不是住宅出口的节点，并返回过滤统计。"""
    kept = []
    rejected = []

    for server in servers:
        reason = local_ip_quality_filter_reason(server)
        if reason:
            rejected.append((server, reason))
        else:
            kept.append(server)

    return kept, rejected


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

def find_openvpn_executable() -> str:
    """查找本机 OpenVPN 命令行客户端。"""
    candidates = []

    if OPENVPN_EXE:
        candidates.append(OPENVPN_EXE)

    path_openvpn = shutil.which("openvpn")
    if path_openvpn:
        candidates.append(path_openvpn)

    if "windows" in platform.system().lower():
        candidates.extend([
            r"C:\Program Files\OpenVPN\bin\openvpn.exe",
            r"C:\Program Files (x86)\OpenVPN\bin\openvpn.exe",
        ])

    for candidate in candidates:
        if not candidate:
            continue

        expanded = os.path.expandvars(candidate)
        if os.path.isfile(expanded):
            return expanded

        resolved = shutil.which(expanded)
        if resolved:
            return resolved

    return ""


def clear_old_ovpn_configs():
    """清空旧的 .ovpn 输出，避免残留不可用节点。"""
    if not os.path.isdir(OUTPUT_DIR):
        return

    for filename in os.listdir(OUTPUT_DIR):
        if not filename.lower().endswith(".ovpn"):
            continue

        filepath = os.path.join(OUTPUT_DIR, filename)
        try:
            os.remove(filepath)
        except OSError as e:
            print(f"删除旧配置失败 {filepath}: {e}")


def list_existing_ovpn_configs() -> List[str]:
    if not os.path.isdir(OUTPUT_DIR):
        return []

    return [
        os.path.join(OUTPUT_DIR, filename)
        for filename in sorted(os.listdir(OUTPUT_DIR))
        if filename.lower().endswith(".ovpn")
    ]


def extract_remote_ip(config_path: str) -> str:
    try:
        with open(config_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) >= 2 and parts[0].lower() == "remote":
                    return parts[1]
    except OSError:
        return ""

    return ""


def write_servers_csv(servers: List[Dict], csv_path="vpngate_good_servers.csv"):
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS)
        writer.writeheader()

        for s in servers:
            row = {k: s.get(k, "") for k in CSV_FIELDS}
            writer.writerow(row)


def read_servers_csv(csv_path="vpngate_good_servers.csv") -> List[Dict]:
    if not os.path.isfile(csv_path):
        return []

    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def filter_csv_by_ips(usable_ips):
    rows = read_servers_csv()
    if rows:
        rows = [row for row in rows if row.get("ip") in usable_ips]
        write_servers_csv(rows)
        return

    write_servers_csv([
        {"ip": ip}
        for ip in sorted(usable_ips)
    ])


def terminate_process(process):
    """尽量干净地结束 OpenVPN 测试进程。"""
    if process.poll() is not None:
        return

    try:
        process.terminate()
        process.wait(timeout=5)
    except Exception:
        try:
            process.kill()
            process.wait(timeout=5)
        except Exception:
            pass


def last_openvpn_message(lines: List[str]) -> str:
    """取最后一行有效 OpenVPN 日志，方便判断失败原因。"""
    for line in reversed(lines):
        text = line.strip()
        if text:
            return text[-240:]

    return "没有 OpenVPN 输出"


def test_openvpn_config(config_path: str, openvpn_exe: str):
    """真实调用 OpenVPN 客户端测试配置是否能连接成功。"""
    cmd = [openvpn_exe, "--config", config_path] + OPENVPN_TEST_ARGS
    lines = []

    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="ignore",
        )
    except Exception as e:
        return False, f"启动 OpenVPN 失败: {e}"

    def collect_output():
        if not process.stdout:
            return

        for line in iter(process.stdout.readline, ""):
            lines.append(line.rstrip())

    output_thread = threading.Thread(target=collect_output, daemon=True)
    output_thread.start()

    deadline = time.time() + OPENVPN_TEST_TIMEOUT
    matched_failure = ""

    try:
        while time.time() < deadline:
            recent_output = "\n".join(lines[-80:]).lower()

            if OPENVPN_SUCCESS_TEXT.lower() in recent_output:
                terminate_process(process)
                output_thread.join(timeout=2)
                return True, "连接成功"

            for failure_text in OPENVPN_FAILURE_TEXTS:
                if failure_text.lower() in recent_output:
                    matched_failure = failure_text
                    break

            if matched_failure or process.poll() is not None:
                break

            time.sleep(0.2)
    finally:
        terminate_process(process)
        output_thread.join(timeout=2)

    if matched_failure:
        return False, matched_failure

    if time.time() >= deadline:
        return False, f"{OPENVPN_TEST_TIMEOUT} 秒内没有连接成功"

    return False, last_openvpn_message(lines)


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


def parse_args():
    parser = argparse.ArgumentParser(
        description="筛选 VPN Gate OpenVPN 配置。"
    )
    parser.add_argument(
        "--fetch-only",
        action="store_true",
        help="只获取 VPN Gate 列表并生成候选 .ovpn，不做 OpenVPN 连接验证。",
    )
    parser.add_argument(
        "--verify-existing",
        action="store_true",
        help="不访问 VPN Gate，只验证当前 vpngate_ovpn_configs 目录里的 .ovpn。",
    )
    parser.add_argument(
        "--no-local-filter",
        action="store_true",
        help="关闭本地公共 VPN/机房特征过滤。",
    )
    return parser.parse_args()


def save_candidate_configs(filtered: List[Dict]):
    clear_old_ovpn_configs()

    saved_files = []
    candidate_servers = filtered[:GENERATE_TOP_N]

    for i, server in enumerate(candidate_servers, 1):
        filepath = save_ovpn_config(server, i)
        if filepath:
            saved_files.append(filepath)
            print(f"已生成候选配置: {filepath}")
        else:
            print(f"生成失败: {server['ip']}")

    write_servers_csv(candidate_servers)
    print(f"\n已生成候选配置 {len(saved_files)} 个。")
    print("候选服务器列表: vpngate_good_servers.csv")
    print(f"配置文件目录: {OUTPUT_DIR}")
    print("\n如果你是开着其它 VPN 才能获取列表：")
    print("1. 现在先断开其它 VPN/代理")
    print("2. 再运行: python vpngate_filter.py --verify-existing")
    print("这样留下来的才是当前直连网络可用的 OpenVPN 节点。")


def verify_existing_configs(skip_local_filter=False):
    openvpn_exe = find_openvpn_executable()
    if not openvpn_exe:
        print("\n未找到 openvpn 命令行客户端，无法验证客户端是否可用。")
        print("请安装 OpenVPN GUI，或把 OPENVPN_EXE 改成 openvpn.exe 的完整路径。")
        return

    configs = list_existing_ovpn_configs()
    if not configs:
        print(f"\n没有找到待验证配置，请先生成: {OUTPUT_DIR}")
        return

    print(f"\n使用 OpenVPN 客户端验证: {openvpn_exe}")
    print("请确认当前没有开其它 VPN/代理，否则验证结果可能只代表代理后的网络。")
    print(f"待验证配置: {len(configs)} 个，每个最多 {OPENVPN_TEST_TIMEOUT} 秒。")

    usable_ips = set()
    usable_configs = []
    servers_by_ip = {
        row.get("ip"): row
        for row in read_servers_csv()
        if row.get("ip")
    }

    for config_path in configs:
        ip = extract_remote_ip(config_path) or os.path.basename(config_path)

        if ENABLE_LOCAL_IP_QUALITY_FILTER and not skip_local_filter:
            server = servers_by_ip.get(ip, {
                "ip": ip,
                "hostname": os.path.basename(config_path),
                "operator": "",
                "message": "",
            })
            reason = local_ip_quality_filter_reason(server)
            if reason:
                try:
                    os.remove(config_path)
                except OSError:
                    pass
                print(f"跳过 {ip}，已删除: {reason}")
                continue

        print(f"测试 {ip} ... ", end="", flush=True)
        is_usable, reason = test_openvpn_config(config_path, openvpn_exe)

        if is_usable:
            usable_ips.add(ip)
            usable_configs.append(config_path)
            print("可用，已保留")
        else:
            try:
                os.remove(config_path)
            except OSError:
                pass
            print(f"不可用，已删除: {reason}")

    filter_csv_by_ips(usable_ips)

    print(f"\n验证完成，可用节点: {len(usable_configs)}")
    print("已更新: vpngate_good_servers.csv")
    print(f"配置文件目录: {OUTPUT_DIR}")


def main():
    args = parse_args()

    if args.fetch_only and args.verify_existing:
        print("--fetch-only 和 --verify-existing 不能同时使用。")
        return

    if args.verify_existing:
        verify_existing_configs(skip_local_filter=args.no_local_filter)
        return

    print("正在获取 VPN Gate 服务器列表...")
    data = fetch_vpngate_servers()

    if not data:
        print("\n如果只有开其它 VPN 才能访问 vpngate.net，可以按两步走：")
        print("1. 开其它 VPN 后运行: python vpngate_filter.py --fetch-only")
        print("2. 关闭其它 VPN 后运行: python vpngate_filter.py --verify-existing")
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

    if ENABLE_LOCAL_IP_QUALITY_FILTER and not args.no_local_filter:
        before_count = len(filtered)
        filtered, rejected = apply_local_ip_quality_filter(filtered)
        print(f"本地 IP 质量过滤: 排除 {before_count - len(filtered)} 个，剩余 {len(filtered)} 个")

        for server, reason in rejected[:5]:
            print(f"  跳过 {server['ip']}: {reason}")

        if len(rejected) > 5:
            print(f"  ... 还有 {len(rejected) - 5} 个被过滤")

    filtered.sort(key=lambda x: x["score"], reverse=True)

    if not filtered:
        print("没有筛选到合适服务器。")
        if ENABLE_LOCAL_IP_QUALITY_FILTER and not args.no_local_filter:
            print("本地公共 VPN/机房过滤可能过严；如需临时关闭可运行: python vpngate_filter.py --no-local-filter")
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

    if args.fetch_only:
        print("\n当前是 fetch-only 模式，只生成候选配置，不验证连接。")
        save_candidate_configs(filtered)
        return

    if VERIFY_WITH_OPENVPN_CLIENT:
        openvpn_exe = find_openvpn_executable()
        if not openvpn_exe:
            print("\n未找到 openvpn 命令行客户端，无法验证客户端是否可用。")
            print("请安装 OpenVPN GUI，或把 OPENVPN_EXE 改成 openvpn.exe 的完整路径。")
            return

        print(f"\n使用 OpenVPN 客户端验证: {openvpn_exe}")
        print("注意：如果当前开着其它 VPN/代理，验证结果可能只代表代理后的网络。")
        print(f"每个节点最多测试 {OPENVPN_TEST_TIMEOUT} 秒，直到保留 {GENERATE_TOP_N} 个可用配置。")

        clear_old_ovpn_configs()

        saved_files = []
        usable_servers = []

        for server in filtered:
            if len(usable_servers) >= GENERATE_TOP_N:
                break

            index = len(usable_servers) + 1
            filepath = save_ovpn_config(server, index)
            if not filepath:
                print(f"生成失败: {server['ip']}")
                continue

            print(f"测试 {server['ip']} ... ", end="", flush=True)
            is_usable, reason = test_openvpn_config(filepath, openvpn_exe)

            if is_usable:
                saved_files.append(filepath)
                usable_servers.append(server)
                print(f"可用，已保留 {filepath}")
            else:
                try:
                    os.remove(filepath)
                except OSError:
                    pass
                print(f"不可用: {reason}")

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

            for s in usable_servers:
                row = {k: s.get(k, "") for k in csv_fields}
                writer.writerow(row)

        print(f"\nOpenVPN 客户端验证完成，可用节点: {len(usable_servers)}")
        print(f"已保存可用服务器列表到: {csv_path}")
        print(f"配置文件目录: {OUTPUT_DIR}")

        if not usable_servers:
            print("没有找到可用节点。可以放宽筛选条件，或提高 OPENVPN_TEST_TIMEOUT 后重试。")

        return

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

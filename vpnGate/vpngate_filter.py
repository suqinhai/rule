import requests
import csv
import subprocess
import time
from io import StringIO
from typing import List, Dict

def fetch_vpngate_servers():
    """获取 VPN Gate 服务器列表"""
    url = "https://www.vpngate.net/api/iphone/"
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"获取列表失败: {e}")
        return None

def parse_servers(data: str) -> List[Dict]:
    """解析 CSV 数据"""
    servers = []
    reader = csv.reader(StringIO(data), delimiter=',')
    next(reader)  # 跳过 *vpn_servers
    next(reader)  # 跳过标题行
    
    for row in reader:
        if len(row) < 10 or not row[1]:  # 至少要有 IP
            continue
        try:
            server = {
                'hostname': row[0],
                'ip': row[1],
                'score': int(row[2]),
                'ping': int(row[3]),
                'speed': int(row[4]),      # 字节/秒
                'country_long': row[5],
                'country_short': row[6],
                'sessions': int(row[7]),
                'uptime_days': round(int(row[8]) / 86400, 1),  # 秒转天
            }
            servers.append(server)
        except:
            continue
    return servers

def ping_test(ip: str, timeout=2) -> bool:
    """Ping 测试 IP 是否可达"""
    try:
        # Windows: -n 1, Linux/Mac: -c 1
        count_flag = "-n" if subprocess.getoutput("system").lower().find("win") != -1 else "-c"
        output = subprocess.check_output(
            ["ping", count_flag, "1", "-w", str(timeout*1000), ip],
            stderr=subprocess.STDOUT,
            timeout=timeout+2
        ).decode('utf-8', errors='ignore')
        return "TTL=" in output or "bytes from" in output.lower()
    except:
        return False

def main():
    print("正在获取 VPN Gate 服务器列表...")
    data = fetch_vpngate_servers()
    if not data:
        return
    
    servers = parse_servers(data)
    print(f"共获取 {len(servers)} 个服务器")
    
    # 筛选条件（可自行调整）
    filtered = [
        s for s in servers 
        if s['ping'] < 150          # Ping < 150ms
        and s['score'] > 500000     # 分数较高
        and s['uptime_days'] > 1    # 在线超过1天
        and s['speed'] > 10000000   # 速度 > 10Mbps 左右
    ]
    
    # 按分数排序
    filtered.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"\n筛选后剩余 {len(filtered)} 个优质服务器（前10个显示）：")
    for i, s in enumerate(filtered[:15], 1):
        print(f"{i:2d}. {s['country_long']} ({s['ip']}) | Ping:{s['ping']}ms | "
              f"Speed:{s['speed']//1000000}Mbps | Uptime:{s['uptime_days']}天 | Score:{s['score']}")
    
    # 可选：Ping 测试前 N 个（比较慢）
    test_count = 5
    print(f"\n正在 Ping 测试前 {test_count} 个服务器...")
    for s in filtered[:test_count]:
        print(f"测试 {s['ip']} ... ", end="")
        if ping_test(s['ip']):
            print("✅ 可达")
        else:
            print("❌ 可能不可达")
        time.sleep(1)
    
    # 保存到 CSV
    with open("vpngate_good_servers.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=filtered[0].keys())
        writer.writeheader()
        writer.writerows(filtered)
    print("\n已保存所有筛选结果到 vpngate_good_servers.csv")

if __name__ == "__main__":
    main()
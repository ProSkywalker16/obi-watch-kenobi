import subprocess

def quarantine_ip(ip):
    try:
        # Example: add a DROP rule to iptables to block the IP completely
        subprocess.run(["iptables", "-A", "INPUT", "-s", ip, "-j", "DROP"], check=True)
        print(f"[ACTION] Quarantined IP: {ip}")
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Failed to quarantine IP {ip}: {e}")

import os
import time

def block_ip(ip, duration=300):
    os.system(f"sudo ufw deny from {ip}")
    time.sleep(duration)
    unblock_ip(ip)

def unblock_ip(ip):
    os.system(f"sudo ufw delete deny from {ip}")

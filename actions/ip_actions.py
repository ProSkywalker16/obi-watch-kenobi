import subprocess
from actions.utils import log_action

def block_ip(ip):
    subprocess.run(["sudo", "ufw", "deny", "from", ip], capture_output=True)
    log_action(ip, "blocked_ip", "CRITICAL")

def unblock_ip(ip):
    subprocess.run(["sudo", "ufw", "delete", "deny", "from", ip], capture_output=True)
    log_action(ip, "unblocked_ip", "INFO")

def quarantine_ip(ip):
    subprocess.run(["sudo", "ufw", "deny", "from", ip], capture_output=True)
    log_action(ip, "quarantined_ip", "CRITICAL")

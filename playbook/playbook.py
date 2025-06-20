import datetime
from actions.utils import (
    fetch_recent_logs,
    log_action,
    send_email_alert,
    count_ip_offenses,
    get_ip_type
)
from actions.ip_actions import block_ip, quarantine_ip
from actions.file_actions import delete_file, revert_file
from playbook.rules_config import AUTHORIZED_IPS, THRESHOLD

def run_playbook():
    print(f"[{datetime.datetime.now()}] Playbook start — processing last 5 logs.")

    # No need to pass a limit; default is now 5
    logs = fetch_recent_logs()

    if not logs:
        print("[DEBUG] No actionable logs found.")
        return

    for e in logs:
        ip       = e["ip"]
        action   = e["action"]
        severity = e["severity"]

        print(f"[DEBUG] Processing: IP={ip} | action={action} | severity={severity}")

        # Record every detection
        log_action(ip, action, severity)

        # Email alerts for HIGH/CRITICAL
        send_email_alert(ip, action, severity)

        # Enforcement logic
        if action == "unauthorized_access":
            if get_ip_type(ip) == "public":
                block_ip(ip)
            if count_ip_offenses(ip) > THRESHOLD:
                quarantine_ip(ip)

        elif action == "nmap_scan":
            block_ip(ip)

        elif action == "new_file":
            delete_file(e.get("file", ""), ip)
            if count_ip_offenses(ip) > THRESHOLD:
                quarantine_ip(ip)

        elif action == "file_tampering":
            revert_file(e.get("file", ""), f"{e.get('file','')}.bak", ip)
            if count_ip_offenses(ip) > THRESHOLD:
                quarantine_ip(ip)

    print(f"[{datetime.datetime.now()}] Playbook complete.")

import os
import re
import mysql.connector
import ipaddress
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()  # loads MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, EMAIL_SENDER, EMAIL_PASSWORD

DB_CONFIG = {
    'host': os.getenv("MYSQL_HOST"),
    'user': os.getenv("MYSQL_USER"),
    'password': os.getenv("MYSQL_PASSWORD"),
    'database': os.getenv("MYSQL_DB")
}

EMAIL_SENDER   = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVER = "chaudhuripromit16@gmail.com"

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

def fetch_recent_logs(limit=5):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Order by id DESC to get the true last N rows
    cursor.execute(
        "SELECT id, timestamp, log_entry, severity, extracted_ip "
        "FROM log_storage "
        "ORDER BY id DESC "
        "LIMIT %s",
        (limit,)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    parsed = []
    for row in rows:
        text  = row["log_entry"]
        lower = text.lower()
        ip    = row.get("extracted_ip") or "-"

        # fallback: extract src=IP from the log text
        if ip == "-" or not ip.strip():
            m = re.search(r"src=(\d+\.\d+\.\d+\.\d+)", lower)
            if m:
                ip = m.group(1)

        action = None
        if "[ufw block]" in lower:
            action = "unauthorized_access"
        elif "nmap" in lower:
            action = "nmap_scan"
        elif "created" in lower or "new file" in lower:
            action = "new_file"
        elif "modified" in lower or "tampered" in lower:
            action = "file_tampering"

        if ip != "-" and action:
            parsed.append({
                "id":        row["id"],
                "timestamp": row["timestamp"],
                "ip":        ip,
                "action":    action,
                "severity":  row["severity"].upper()
            })

    print(f"[DEBUG] Parsed {len(parsed)} actionable logs (last {limit} rows ordered by id).")
    return parsed

def log_action(ip, activity, severity):
    conn   = get_db_connection()
    cursor = conn.cursor()
    ts     = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute(
        "INSERT INTO actions (ip, activity, severity, timestamp) VALUES (%s,%s,%s,%s)",
        (ip, activity, severity, ts)
    )
    conn.commit()
    cursor.close()
    conn.close()
    print(f"[LOGGED] {ts} | {ip} | {activity} | {severity}")

def count_ip_offenses(ip):
    conn   = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM actions WHERE ip=%s", (ip,))
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return count

def get_ip_type(ip):
    try:
        return "private" if ipaddress.ip_address(ip).is_private else "public"
    except ValueError:
        return "invalid"

def send_email_alert(ip, activity, severity):
    from email.message import EmailMessage
    if severity not in ("HIGH", "CRITICAL"):
        return
    subject = f"[{severity}] {activity} from {ip}"
    body    = (
        f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        f"Activity: {activity}\nIP: {ip}\nSeverity: {severity}"
    )
    msg = EmailMessage()
    msg["From"]    = EMAIL_SENDER
    msg["To"]      = EMAIL_RECEIVER
    msg["Subject"] = subject
    msg.set_content(body)
    import smtplib
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
        smtp.send_message(msg)
    print(f"[EMAIL] Sent {severity} alert for {ip}")

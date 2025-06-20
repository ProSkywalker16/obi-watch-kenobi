import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

def send_alert(ip, activity, severity):
    if severity not in ["HIGH", "CRITICAL"]:
        return

    sender = os.getenv("EMAIL_SENDER")
    password = os.getenv("EMAIL_PASSWORD")
    recipient = "chaudhuripromit16@gmail.com"

    subject = f"ALERT [{severity}] from IP {ip}"
    body = f"Suspicious activity: {activity} detected from IP: {ip}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, password)
        server.send_message(msg)

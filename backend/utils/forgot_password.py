from email.message import EmailMessage
from dotenv import load_dotenv
import smtplib
from random import randint
load_dotenv()
import os

def send_verification_email(to_email):
    msg = EmailMessage()
    msg['Subject'] = "Password Reset Request: Your Verification Code"
    msg['From'] = os.getenv('EMAIL_SENDER')
    msg['To'] = to_email
    # Generate a random 6-digit verification code
    alphanum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    alphanum_code = ''.join(alphanum[randint(0, 61)] for _ in range(6))
    body = f"Your verification code is: {alphanum_code}\n\nPlease use this code to reset your password."
    msg.set_content(body)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(os.getenv('EMAIL_SENDER'), os.getenv('EMAIL_PASSWORD'))
            smtp.send_message(msg)
    except smtplib.SMTPException as e:
        print(f"Failed to send email: {e}")
        return None
    return alphanum_code  # Return the generated code for further processing
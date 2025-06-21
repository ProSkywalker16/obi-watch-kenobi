from email.message import EmailMessage
from dotenv import load_dotenv
import smtplib
from random import randint
load_dotenv()
import os

def generate_verification_code():
    """Generates a random 6-digit alphanumeric verification code."""
    alphanum = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(alphanum[randint(0, 61)] for _ in range(6))

def send_email(to_email, subject, body):
    """Sends an email with the specified subject and body to the given email address."""
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = os.getenv('EMAIL_SENDER')
    msg['To'] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(os.getenv('EMAIL_SENDER'), os.getenv('EMAIL_PASSWORD'))
            smtp.send_message(msg)
    except smtplib.SMTPException as e:
        print(f"Failed to send email: {e}")
        return False
    return True

def send_verification_email(to_email):
    subject = "Password Reset Request: Your Verification Code"
    # Generate a random 6-digit verification code
    alphanum_code = generate_verification_code()
    body = f"Your verification code is: {alphanum_code}\n\nPlease use this code to reset your password."

    # Send the verification email
    if not send_email(to_email, subject, body):
        return None
    return alphanum_code  # Return the generated code for further processing
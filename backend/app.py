# app.py
from flask import Flask, jsonify, request, session
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import os
import hashlib
from google import genai
import secrets
from utils.ipinfofetcher import getIPDetails
from datetime import timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow credentials for login sessions

# Session configuration
app.secret_key = os.getenv('SECRET_KEY', 'supersecretkey')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

# Gemini API client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# MySQL config
app.config['MYSQL_HOST']     = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER']     = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB']       = os.getenv('MYSQL_DB')

mysql = MySQL(app)

# ─── Helper: salted hash utilities ────────────────────────────────────────────

def generate_salt() -> str:
    """Return a new, random 16-byte salt as a 32‑char hex string."""
    return secrets.token_hex(16)

def hash_password(password: str, salt: str) -> str:
    """
    Return the hex‑encoded SHA‑256 of (salt + password).
    """
    return hashlib.sha256((salt + password).encode()).hexdigest()

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Flask API"})

@app.route('/data', methods=['GET'])
def get_data():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM logs')
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@app.route('/log_storage/ipinfo', methods=['GET'])
def get_ipinfo():
    ip_address = request.args.get('ip_address')
    return jsonify(getIPDetails(ip_address))

@app.route('/users', methods=['GET'])
def get_users():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM users')
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@app.route('/log_storage', methods=['GET'])
def get_log_storage():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM log_storage')
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@app.route('/log_storage/filter', methods=['GET'])
def filter_log_storage():
    severity = request.args.get('severity')
    ip = request.args.get('ip')

    query = 'SELECT * FROM log_storage WHERE 1=1'
    params = []

    if severity:
        query += ' AND severity = %s'
        params.append(severity)
    if ip:
        query += ' AND ip_address = %s'
        params.append(ip)

    cursor = mysql.connection.cursor()
    cursor.execute(query, params)
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        question = request.json.get('question', '').strip()
        if not question:
            return jsonify({"answer": "Please provide a question."})

        cursor = mysql.connection.cursor()
        cursor.execute("DESCRIBE log_storage")
        schema = cursor.fetchall()
        cursor.execute('SELECT * FROM log_storage')
        sample_data = cursor.fetchall()
        cursor.close()

        prompt = f"""
            You are a helpful assistant for a SIEM system. Answer questions about the 'logs' table.

            TABLE SCHEMA:
            {schema}

            SAMPLE DATA:
            {sample_data}

            USER QUESTION:
            "{question}"

            Respond in a clear, user-friendly way without showing SQL code.
        """
        try:
            response = client.models.generate_content(
                model="models/gemini-1.5-flash-8b",
                contents=prompt,
            )
            return jsonify({"answer": response.text})
        except Exception as ai_error:
            return jsonify({"answer": "AI failed to generate a response. Please try again."})
    except Exception as e:
        return jsonify({"answer": "An unexpected error occurred. Please try again."})

# ─── Registration Endpoint with secret code ───────────────────────────────────
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    secret_code = data.get('secret_code', '')

    if not email or not password or not secret_code:
        return jsonify({'error': 'Missing email, password or secret code'}), 400

    # Check secret code
    if secret_code != "rohanisgay":
        return jsonify({'error': 'Invalid secret code'}), 403

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({'error': 'User already exists'}), 409

    salt = os.urandom(16).hex()
    hashed_password = hashlib.scrypt(
        password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1
    ).hex()

    cursor.execute(
        "INSERT INTO users (email, password, salt) VALUES (%s, %s, %s)",
        (email, hashed_password, salt)
    )
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'User registered successfully'}), 201

# ─── Login System ─────────────────────────────────────────────────────────────

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    cursor = mysql.connection.cursor()
    cursor.execute(
        "SELECT password, salt FROM users WHERE email = %s",
        (email,)
    )
    row = cursor.fetchone()
    cursor.close()

    if row:
        stored_hash, salt = row
        test_hash = hashlib.scrypt(
            password.encode(), salt=bytes.fromhex(salt), n=16384, r=8, p=1
        ).hex()
        if test_hash == stored_hash:
            session.permanent = True
            session['authenticated'] = True
            session['user_email'] = email
            return jsonify({'message': 'Login successful'}), 200

    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'}), 200

@app.route('/protected', methods=['GET'])
def protected():
    if session.get('authenticated'):
        return jsonify({'message': f"Welcome, {session.get('user_email')}!"}), 200
    return jsonify({'error': 'Unauthorized'}), 401

# ─── New endpoint to fetch actions ────────────────────────────────────────────
@app.route('/actions', methods=['GET'])
def get_actions():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT id, ip, activity, severity, timestamp FROM actions ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        cursor.close()

        actions_list = [
            {
                "id": row[0],
                "ip": row[1],
                "activity": row[2],
                "severity": row[3],
                "timestamp": row[4].strftime('%Y-%m-%d %H:%M:%S') if row[4] else None
            }
            for row in rows
        ]

        return jsonify(actions_list)

    except Exception as e:
        print("Error fetching actions:", e)
        return jsonify({"error": "Failed to fetch actions"}), 500

# ─── Main ────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    app.run(
        debug=True,
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000))
    )

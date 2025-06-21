# Obi-Watch-Kenobi 👁️⚔️

A lightweight, AI-powered **Security Information and Event Management (SIEM)** and **Endpoint Detection and Response (EDR)** application designed for real-time intrusion detection, intelligent response, and secure log monitoring — all built by hackers, for defenders.

---

## 🔒 Project Summary

**Obi-Watch-Kenobi** offers a robust platform for detecting cyber threats, visualizing log data, automating incident responses via playbooks, and interacting with an intelligent chatbot for log analysis. It operates on a distributed setup using ZeroTier, making it suitable for securing small to medium-sized networks with minimal overhead.

---

## 🧠 Key Features

- **📊 Real-Time Log Dashboard**: Visualize logs categorized by severity.
- **🤖 AI-Powered Playbooks**: Automated response actions (block, quarantine, alert) triggered based on severity and IP behavior.
- **🕵️ Threat Intelligence**: Categorize and score threats using internal logic.
- **💬 Gemini Chatbot Integration**: Query logs with natural language and get intelligent summaries.
- **🔐 Secure Login System**: User authentication with scrypt hashing.
- **🌐 Distributed Over ZeroTier**: Connect remote agents and databases across virtual private networks.
- **📁 File Tamper Detection**: Detect and revert changes to critical files.
- **🛡️ IP Analysis**: Detect unauthorized or suspicious IPs (private/public) and take context-aware actions.
- **📥 MariaDB-Backed Storage**: Logs, actions, and users stored securely.

---

## 🚀 Tech Stack

| Layer       | Tech Used                             |
|------------|----------------------------------------|
| Frontend   | ReactJS, TailwindCSS, Lucide Icons     |
| Backend    | Flask (Python)                         |
| Database   | MariaDB                                |
| AI & Chat  | Gemini API                             |
| Network    | ZeroTier                               |

---

## 🖥️ System Architecture

- `Frontend`: React-based interface for dashboard and chatbot.
- `Backend`: Flask server with API endpoints to fetch logs, users, actions.
- `AI Module`: Interacts with Gemini API for chatbot and automated decisions.
- `Database`: MariaDB storing `logs`, `users`, `actions`, etc.
- `Remote Agent`: Deployed on different machines to send logs via ZeroTier.

---

## 🧪 Use Cases

| Use Case                              | Action Taken                                  |
|--------------------------------------|-----------------------------------------------|
| Unauthorized IP Login                | Alert + Severity calculated                   |
| Public IP Writes to File             | File deleted + IP temporarily blocked         |
| Repeated Offense by IP               | IP permanently blocked + quarantined          |
| Nmap Scan Detected                   | Critical alert sent to admin                  |
| File Tampering Detected              | File reverted + offender flagged              |
| Chatbot Asked "Last 5 critical logs" | Gemini fetches and formats result from DB     |

---

## ⚙️ Setup Preliminaries

### Prerequisites

- Python 3.8+
- Node.js & npm
- MariaDB
- ZeroTier account

### 💾 Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```


### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```



### 🗄️ Database Setup
Ensure MariaDB is running.

Use the provided schema to create the following tables:

 - users

 - logs

 - actions


### 🌐 ZeroTier Setup (For Remote Device Integration)

To securely connect devices (such as the frontend host, backend server, and database server) over different physical networks, we use ZeroTier — a virtual LAN tool.

## ✅ Step-by-Step Setup Guide

### 1. Install ZeroTier
Install ZeroTier on all devices you want to connect (e.g., your main server, frontend dev laptop, database host, etc.).

#### On Ubuntu/Debian
```bash
curl -s https://install.zerotier.com | sudo bash
sudo zerotier-cli join <your-network-id>
```


#### On Windows/Mac

1. **Download** ZeroTier from:  
   https://www.zerotier.com/download/

2. **Launch** the app and **Join Network** using your Network ID.

---

### 2. Create or Use a ZeroTier Network

1. Go to [my.zerotier.com](https://my.zerotier.com)  
2. Log in and click **Create a Network**  
3. Copy the **Network ID** shown (you’ll use this in the step above)  
4. Configure the network as follows:
   - **Access Control**: Private (you manually approve devices)  
   - **IPv4 Auto-Assignment**: Enabled (default settings are fine)

---

### 3. Authorize Devices

Once devices have joined the network:

1. Visit your network dashboard on [my.zerotier.com](https://my.zerotier.com)  
2. Under **Members**, click the checkbox next to each new device to authorize them.

---

### 4. Verify Connection

On each device, run:

```bash
zerotier-cli listpeers
ifconfig    # or `ip a` to see the ZeroTier-assigned IP (e.g., 192.168.x.x)
```
Then ping between machines to confirm connectivity:

```
ping <zerotier-ip-of-other-device>
```
### 5. Configure Firewall (Optional but Recommended)

#### 5.1
To allow proper communication, open the following ports in UFW or your preferred firewall:

Flask Backend (e.g., port 5000):
```
sudo ufw allow from <zerotier-subnet> to any port 5000
``` 

MariaDB (default port 3306) if accessed remotely:

```
sudo ufw allow from <zerotier-subnet> to any port 3306
```

#### 5.2
Replace <zerotier-subnet> with your network range (e.g., 192.168.192.0/24).

#### 5.3
Start Your Services

Once ZeroTier connections are active:
* Start the Flask backend on the server:
    ```python backend/app.py```

* Start the frontend:
    ```
    cd frontend
    npm run dev
    ```

* Ensure MariaDB is running and accessible over the ZeroTier network.

---

## 🔧 Automated Threat Response Playbook

This repository contains an automated security playbook designed to detect and react to suspicious activities on a system. Think of it as an intelligent security guard that's always watching and ready to take action.

### How it works (The "Brain" behind the Guard)

Our system operates in a continuous loop, like a diligent watchman:

* **Listens for Alerts**: Every few seconds, it quickly checks the most recent system logs (like a security camera reviewing the last few moments).
* **Identifies the Threat**: For each suspicious log entry, it figures out:
* **Who**: Which IP address (the unique internet address of a computer) was involved.
* **What**: What kind of suspicious activity was detected (e.g., someone trying to get in without permission, scanning for weaknesses, creating unexpected files, or changing important files).
* **How serious**: How critical is this threat (e.g., minor, high alert, or critical).
* **Takes Action**: The "Playbook":
* **Records Everything**: First, it always writes down what happened – who did what, when, and how serious it was. This is like keeping a detailed incident report.
* **Sends an SOS**: For important threats, it immediately sends an email alert to the security team, so humans are aware.
* **Fights Back (Automated Responses)**: This is where the real "playbook" comes in. Based on what it detected, it takes specific, automated steps:
* **Unauthorized Access**: If an unknown computer tries to log in, it will block that computer's IP address from accessing the system. If that same computer keeps trying multiple times, it gets "quarantined" – a more severe isolation to prevent further harm.
* **Network Scans (Nmap Scan)**: If it sees someone actively scanning the system to find weaknesses, it immediately blocks their IP address.
* **New, Suspicious Files**: If an unexpected new file appears (which could be malware), the system automatically deletes that file. If the source of that file is a repeat offender, their IP also gets quarantined.
* **File Tampering**: If an important system file is unexpectedly changed, the playbook tries to revert that file back to its original, safe version using a backup. If the source of the tampering is a repeat offender, their IP also gets quarantined.

### Why is this useful?

* **Speed**: It reacts to threats much faster than a human can, potentially stopping attacks before they cause significant damage.
* **Consistency**: It applies the same security rules every time, reducing human error.
* **Efficiency**: Automates routine responses, freeing up security analysts to focus on more complex threats.
* **Layered Defense**: Combines alerting, logging, and active countermeasures for a more robust security posture.

import ipinfo
import json
from dotenv import load_dotenv
import os

load_dotenv()

access_token = os.getenv('IPINFO_ACCESS_TOKEN')
handler = ipinfo.getHandler(access_token=access_token)

def getIPDetails(ip_address):
    return json.dumps(handler.getDetails(ip_address=ip_address).all)
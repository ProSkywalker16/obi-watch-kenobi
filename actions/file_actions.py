import os
import shutil
from actions.utils import log_action

def delete_file(filepath, ip):
    if os.path.exists(filepath):
        os.remove(filepath)
        log_action(ip, f"deleted_file:{filepath}", "HIGH")
    else:
        log_action(ip, f"delete_failed:{filepath}", "INFO")

def revert_file(filepath, backup_path, ip):
    if os.path.exists(backup_path):
        shutil.copy2(backup_path, filepath)
        log_action(ip, f"reverted_file:{filepath}", "HIGH")
    else:
        log_action(ip, f"revert_failed:{filepath}", "INFO")

import shutil

def revert_file(file_path):
    backup_path = f"{file_path}.bak"
    shutil.copy(backup_path, file_path)

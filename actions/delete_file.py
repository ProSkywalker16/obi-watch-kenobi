import os

def delete_file(file_path):
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"[ACTION] Deleted file: {file_path}")
        except Exception as e:
            print(f"[ERROR] Failed to delete {file_path}: {e}")
    else:
        print(f"[SKIP] File not found or invalid path: {file_path}")

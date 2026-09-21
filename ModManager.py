import os
import sys
import json
import time
import shutil
import socket
import threading
import subprocess
import webbrowser
import http.server
import socketserver
import tkinter as tk
from tkinter import filedialog
import webview

if getattr(sys, 'frozen', False):
    BASE_DIR = os.path.dirname(os.path.abspath(sys.executable))
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODS_FILE = os.path.join(BASE_DIR, "mods.json")
IMG_DIR = os.path.join(BASE_DIR, "assets", "images", "projects")

def find_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('', 0))
    port = s.getsockname()[1]
    s.close()
    return port

PORT = find_free_port()

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def start_server():
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), QuietHandler)
    httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()

class ModManagerAPI:
    def __init__(self, window):
        self.window = window

    def get_mods(self):
        if not os.path.exists(MODS_FILE):
            return []
        try:
            with open(MODS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            return []

    def save_mod(self, mod_data):
        try:
            mods = self.get_mods()
            mod_id = mod_data.get("id", "").strip().lower().replace(" ", "-")
            if not mod_id:
                mod_id = f"mod-{int(time.time())}"
            mod_data["id"] = mod_id

            found = False
            for idx, m in enumerate(mods):
                if m.get("id") == mod_id:
                    mods[idx] = mod_data
                    found = True
                    break
            if not found:
                mods.insert(0, mod_data)

            with open(MODS_FILE, "w", encoding="utf-8") as f:
                json.dump(mods, f, indent=2, ensure_ascii=False)

            return {"success": True, "mod": mod_data}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def delete_mod(self, mod_id):
        try:
            mods = self.get_mods()
            mods = [m for m in mods if m.get("id") != mod_id]
            with open(MODS_FILE, "w", encoding="utf-8") as f:
                json.dump(mods, f, indent=2, ensure_ascii=False)
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def pick_image(self):
        try:
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            file_path = filedialog.askopenfilename(
                title="Mod Küçük Resmini / İkonunu Seç",
                filetypes=[("Resim Dosyaları", "*.png;*.jpg;*.jpeg;*.svg;*.webp;*.ico"), ("Tüm Dosyalar", "*.*")]
            )
            root.destroy()
            if not file_path:
                return {"success": False, "cancelled": True}

            os.makedirs(IMG_DIR, exist_ok=True)
            filename = os.path.basename(file_path)
            dest_path = os.path.join(IMG_DIR, filename)
            shutil.copy2(file_path, dest_path)

            rel_path = f"./assets/images/projects/{filename}"
            return {"success": True, "path": rel_path}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def publish_github(self):
        try:
            subprocess.run(["git", "add", "."], cwd=BASE_DIR, check=True)
            subprocess.run(["git", "commit", "-m", "update: mods updated via ModManager"], cwd=BASE_DIR, capture_output=True, text=True)
            res = subprocess.run(["git", "push", "origin", "main"], cwd=BASE_DIR, capture_output=True, text=True)
            if res.returncode == 0:
                return {"success": True, "message": "Değişiklikler GitHub Pages'e başarıyla gönderildi!"}
            else:
                return {"success": False, "error": res.stderr or res.stdout}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def set_window_size(self, mode):
        if mode == "mobile":
            self.window.resize(400, 840)
        elif mode == "desktop":
            self.window.resize(1100, 850)

    def open_external(self):
        webbrowser.open(f"http://127.0.0.1:{PORT}/index.html")

if __name__ == '__main__':
    window = webview.create_window(
        title="Lkxex Mod Hub — Canlı Önizleme & Gelişmiş Mod Yöneticisi",
        url=f"http://127.0.0.1:{PORT}/index.html",
        width=1100,
        height=850,
        min_size=(380, 500),
        background_color="#090c12"
    )
    api = ModManagerAPI(window)
    window.expose(
        api.get_mods,
        api.save_mod,
        api.delete_mod,
        api.pick_image,
        api.publish_github,
        api.set_window_size,
        api.open_external
    )
    webview.start(debug=False)

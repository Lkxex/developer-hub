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
import webview

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")
MANIFEST_PATH = os.path.join(PROJECTS_DIR, "index.json")

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

class SiteAPI:
    def __init__(self, window):
        self.window = window

    def get_projects(self):
        if not os.path.exists(MANIFEST_PATH):
            return []
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                slugs = json.load(f).get("projects", [])
            results = []
            for s in slugs:
                p_file = os.path.join(PROJECTS_DIR, s, "project.json")
                if os.path.exists(p_file):
                    with open(p_file, "r", encoding="utf-8") as pf:
                        results.append(json.load(pf))
            return results
        except Exception as e:
            return []

    def save_project(self, project_data):
        try:
            slug = project_data.get("id", "").strip().lower().replace(" ", "-")
            if not slug:
                return {"success": False, "error": "Geçersiz ID"}
            
            proj_dir = os.path.join(PROJECTS_DIR, slug)
            os.makedirs(proj_dir, exist_ok=True)
            p_file = os.path.join(proj_dir, "project.json")
            with open(p_file, "w", encoding="utf-8") as f:
                json.dump(project_data, f, indent=2, ensure_ascii=False)

            manifest_slugs = []
            if os.path.exists(MANIFEST_PATH):
                with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                    manifest_slugs = json.load(f).get("projects", [])
            
            if slug not in manifest_slugs:
                manifest_slugs.append(slug)
                with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
                    json.dump({"projects": manifest_slugs}, f, indent=2, ensure_ascii=False)

            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def publish_github(self):
        try:
            subprocess.run(["git", "add", "."], cwd=BASE_DIR, check=True)
            subprocess.run(["git", "commit", "-m", "update: Changes published via SiteViewer"], cwd=BASE_DIR, capture_output=True, text=True)
            res = subprocess.run(["git", "push", "origin", "main"], cwd=BASE_DIR, capture_output=True, text=True)
            if res.returncode == 0:
                return {"success": True, "message": "Değişiklikler GitHub'a başarıyla gönderildi!"}
            else:
                return {"success": False, "error": res.stderr or res.stdout}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def set_window_size(self, mode):
        if mode == "mobile":
            self.window.resize(390, 844)
        elif mode == "desktop":
            self.window.resize(1280, 850)

    def open_external(self):
        webbrowser.open(f"http://127.0.0.1:{PORT}/index.html")

def inject_manager_bar(window):
    # Wait for page load
    time.sleep(0.5)
    bar_html = """
    (function() {
        if (document.getElementById('hub-viewer-toolbar')) return;
        const bar = document.createElement('div');
        bar.id = 'hub-viewer-toolbar';
        bar.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99999;display:flex;align-items:center;gap:8px;background:#161b26;border:1px solid #30363d;padding:8px 12px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.6);font-family:-apple-system,sans-serif;font-size:12px;';

        bar.innerHTML = `
            <span style="color:#10b981;font-weight:700;margin-right:4px;">● CANLI ÖNİZLEME</span>
            <button id="btn-vw-refresh" style="background:#21262d;border:1px solid #30363d;color:#f0f6fc;padding:5px 9px;border-radius:5px;cursor:pointer;font-weight:600;">🔄 Yenile</button>
            <button id="btn-vw-mobile" style="background:#21262d;border:1px solid #30363d;color:#f0f6fc;padding:5px 9px;border-radius:5px;cursor:pointer;font-weight:600;">📱 Mobil</button>
            <button id="btn-vw-desktop" style="background:#21262d;border:1px solid #30363d;color:#f0f6fc;padding:5px 9px;border-radius:5px;cursor:pointer;font-weight:600;">💻 Masaüstü</button>
            <button id="btn-vw-browser" style="background:#21262d;border:1px solid #30363d;color:#f0f6fc;padding:5px 9px;border-radius:5px;cursor:pointer;font-weight:600;">🌐 Tarayıcıda Aç</button>
            <button id="btn-vw-push" style="background:#10b981;border:none;color:#fff;padding:5px 12px;border-radius:5px;cursor:pointer;font-weight:700;">🚀 GitHub'a Canlıya Al</button>
        `;
        document.body.appendChild(bar);

        document.getElementById('btn-vw-refresh').onclick = () => window.location.reload();
        document.getElementById('btn-vw-mobile').onclick = () => window.pywebview.api.set_window_size('mobile');
        document.getElementById('btn-vw-desktop').onclick = () => window.pywebview.api.set_window_size('desktop');
        document.getElementById('btn-vw-browser').onclick = () => window.pywebview.api.open_external();
        document.getElementById('btn-vw-push').onclick = async () => {
            const btn = document.getElementById('btn-vw-push');
            btn.textContent = '⏳ Gönderiliyor...';
            btn.disabled = true;
            try {
                const res = await window.pywebview.api.publish_github();
                if (res.success) {
                    alert('✅ ' + res.message);
                } else {
                    alert('❌ Hata: ' + res.error);
                }
            } catch(e) {
                alert('❌ Hata: ' + e);
            } finally {
                btn.textContent = '🚀 GitHub\'a Canlıya Al';
                btn.disabled = false;
            }
        };
    })();
    """
    window.evaluate_js(bar_html)

if __name__ == '__main__':
    window = webview.create_window(
        title="Lkxex Developer Hub — Canlı Site Önizleme & Yönetim",
        url=f"http://127.0.0.1:{PORT}/index.html",
        width=1280,
        height=850,
        min_size=(380, 500),
        background_color="#0a0c10"
    )
    api = SiteAPI(window)
    window.expose(api.get_projects, api.save_project, api.publish_github, api.set_window_size, api.open_external)
    
    # When loaded, inject the floating toolbar
    window.events.loaded += lambda: inject_manager_bar(window)
    
    webview.start(debug=False)

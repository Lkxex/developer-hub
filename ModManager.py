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

def inject_advanced_editor(window):
    time.sleep(0.4)
    js_code = """
    (function() {
        if (document.getElementById('mod-manager-root')) return;

        // 1. Create floating control bar
        const bar = document.createElement('div');
        bar.id = 'mod-manager-root';
        bar.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99999;display:flex;align-items:center;gap:8px;background:#11141e;border:1px solid #313e59;padding:8px 12px;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,0.7);font-family:-apple-system,sans-serif;font-size:12px;';

        bar.innerHTML = `
            <span style="color:#10b981;font-weight:700;margin-right:2px;display:flex;align-items:center;gap:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#10b981;display:inline-block;"></span>
              MOD YÖNETİCİSİ
            </span>
            <button id="btn-adm-add" style="background:#5865F2;border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;">➕ Yeni Mod Ekle</button>
            <button id="btn-adm-refresh" style="background:#1c2436;border:1px solid #313e59;color:#f0f4fc;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600;">🔄 Yenile</button>
            <button id="btn-adm-mobile" style="background:#1c2436;border:1px solid #313e59;color:#f0f4fc;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600;">📱 Mobil</button>
            <button id="btn-adm-desktop" style="background:#1c2436;border:1px solid #313e59;color:#f0f4fc;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600;">💻 Masaüstü</button>
            <button id="btn-adm-browser" style="background:#1c2436;border:1px solid #313e59;color:#f0f4fc;padding:6px 10px;border-radius:6px;cursor:pointer;font-weight:600;">🌐 Tarayıcı</button>
            <button id="btn-adm-push" style="background:#10b981;border:none;color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:700;">🚀 GitHub'a Canlıya Al</button>
        `;
        document.body.appendChild(bar);

        // 2. Create Modal Overlay for Adding/Editing Mod
        const modal = document.createElement('div');
        modal.id = 'mod-editor-modal';
        modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);z-index:100000;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;';

        modal.innerHTML = `
            <div style="background:#10141e;border:1px solid #313e59;border-radius:14px;width:100%;max-width:580px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 16px 48px rgba(0,0,0,0.8);color:#f0f4fc;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
                <div style="padding:16px 20px;border-bottom:1px solid #1f2738;display:flex;justify-content:space-between;align-items:center;">
                    <h3 id="modal-heading" style="font-size:1.15rem;font-weight:700;margin:0;">➕ Yeni Mod Ekle</h3>
                    <button id="modal-close-btn" style="background:transparent;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;line-height:1;">&times;</button>
                </div>
                <form id="mod-edit-form" style="padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;font-size:0.875rem;">
                    <input type="hidden" id="f-id" />
                    
                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Mod Başlığı:</label>
                        <input type="text" id="f-title" required style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;" placeholder="Örn: PES 2021 Discord Rich Presence" />
                    </div>

                    <div style="display:flex;gap:10px;">
                        <div style="flex:1;">
                            <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Sürüm:</label>
                            <input type="text" id="f-version" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;" placeholder="v1.0.11" />
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Küçük Resim / İkon:</label>
                            <div style="display:flex;gap:6px;">
                                <input type="text" id="f-icon" style="flex:1;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;font-size:11px;" placeholder="./assets/images/projects/icon.svg" />
                                <button type="button" id="btn-pick-img" style="background:#1c2436;border:1px solid #313e59;color:#fff;padding:6px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;font-size:11px;">📁 Gözat</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Açıklama (Türkçe):</label>
                        <textarea id="f-tagline-tr" rows="2" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;font-family:inherit;resize:vertical;" placeholder="Modun ne yaptığını kısaca anlatın..."></textarea>
                    </div>

                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Açıklama (İngilizce):</label>
                        <textarea id="f-tagline-en" rows="2" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;font-family:inherit;resize:vertical;" placeholder="Brief description in English..."></textarea>
                    </div>

                    <div style="display:flex;gap:10px;">
                        <div style="flex:1;">
                            <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">İndirme Linki (.zip):</label>
                            <input type="url" id="f-download" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;" placeholder="https://github.com/.../release.zip" />
                        </div>
                        <div style="flex:1;">
                            <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">GitHub Linki:</label>
                            <input type="url" id="f-github" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;" placeholder="https://github.com/..." />
                        </div>
                    </div>

                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Kurulum Satırı (sider.ini / config):</label>
                        <input type="text" id="f-install" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#79c0ff;font-family:monospace;box-sizing:border-box;" placeholder='lua.module = "discord_rpc.lua"' />
                    </div>

                    <div>
                        <label style="display:block;font-weight:600;margin-bottom:4px;color:#94a3b8;">Etiketler (Virgülle ayırın):</label>
                        <input type="text" id="f-tags" style="width:100%;background:#090c12;border:1px solid #1f2738;border-radius:6px;padding:8px 10px;color:#fff;box-sizing:border-box;" placeholder="PES 2021, Sider 7, Discord RPC" />
                    </div>

                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:12px;border-top:1px solid #1f2738;">
                        <button type="button" id="btn-delete-mod" style="display:none;background:#ef4444;border:none;color:#fff;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">🗑️ Bu Modu Sil</button>
                        <div style="display:flex;gap:8px;margin-left:auto;">
                            <button type="button" id="btn-cancel-modal" style="background:#1c2436;border:1px solid #313e59;color:#f0f4fc;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">İptal</button>
                            <button type="submit" style="background:#10b981;border:none;color:#fff;padding:8px 18px;border-radius:6px;cursor:pointer;font-weight:700;">💾 Kaydet</button>
                        </div>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Open Modal Function
        window.openModEditorModal = function(mod = null) {
            modal.style.display = 'flex';
            if (mod) {
                document.getElementById('modal-heading').textContent = '✏️ Mod Düzenle: ' + mod.title;
                document.getElementById('f-id').value = mod.id || '';
                document.getElementById('f-title').value = mod.title || '';
                document.getElementById('f-version').value = mod.version || '';
                document.getElementById('f-icon').value = mod.icon || '';
                document.getElementById('f-tagline-tr').value = mod.tagline_tr || '';
                document.getElementById('f-tagline-en').value = mod.tagline_en || '';
                document.getElementById('f-download').value = mod.download_url || '';
                document.getElementById('f-github').value = mod.github_url || '';
                document.getElementById('f-install').value = mod.install_code || '';
                document.getElementById('f-tags').value = (mod.tags || []).join(', ');
                document.getElementById('btn-delete-mod').style.display = 'inline-block';
            } else {
                document.getElementById('modal-heading').textContent = '➕ Yeni Mod Ekle';
                document.getElementById('mod-edit-form').reset();
                document.getElementById('f-id').value = '';
                document.getElementById('f-icon').value = './assets/images/projects/pes2021-icon.svg';
                document.getElementById('btn-delete-mod').style.display = 'none';
            }
        };

        // Close modal handlers
        const closeModal = () => modal.style.display = 'none';
        document.getElementById('modal-close-btn').onclick = closeModal;
        document.getElementById('btn-cancel-modal').onclick = closeModal;

        // Image picker handler
        document.getElementById('btn-pick-img').onclick = async () => {
            const res = await window.pywebview.api.pick_image();
            if (res.success && res.path) {
                document.getElementById('f-icon').value = res.path;
            }
        };

        // Form Submit (Save Mod)
        document.getElementById('mod-edit-form').onsubmit = async (e) => {
            e.preventDefault();
            const idVal = document.getElementById('f-id').value.trim();
            const titleVal = document.getElementById('f-title').value.trim();
            const tagsArr = document.getElementById('f-tags').value.split(',').map(s => s.trim()).filter(Boolean);

            const modObj = {
                id: idVal || titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                title: titleVal,
                version: document.getElementById('f-version').value.trim(),
                updated: new Date().toISOString().split('T')[0],
                icon: document.getElementById('f-icon').value.trim() || './assets/images/projects/pes2021-icon.svg',
                tagline_tr: document.getElementById('f-tagline-tr').value.trim(),
                tagline_en: document.getElementById('f-tagline-en').value.trim(),
                download_url: document.getElementById('f-download').value.trim(),
                github_url: document.getElementById('f-github').value.trim(),
                install_code: document.getElementById('f-install').value.trim(),
                tags: tagsArr,
                hotkeys: [],
                features_tr: [],
                features_en: []
            };

            const res = await window.pywebview.api.save_mod(modObj);
            if (res.success) {
                closeModal();
                if (window.reloadMods) window.reloadMods();
            } else {
                alert('Hata: ' + res.error);
            }
        };

        // Delete Mod handler
        document.getElementById('btn-delete-mod').onclick = async () => {
            const idVal = document.getElementById('f-id').value.trim();
            if (!idVal) return;
            if (confirm('Bu modu silmek istediğinize emin misiniz?')) {
                const res = await window.pywebview.api.delete_mod(idVal);
                if (res.success) {
                    closeModal();
                    if (window.reloadMods) window.reloadMods();
                } else {
                    alert('Hata: ' + res.error);
                }
            }
        };

        // Button events
        document.getElementById('btn-adm-add').onclick = () => window.openModEditorModal();
        document.getElementById('btn-adm-refresh').onclick = () => window.location.reload();
        document.getElementById('btn-adm-mobile').onclick = () => window.pywebview.api.set_window_size('mobile');
        document.getElementById('btn-adm-desktop').onclick = () => window.pywebview.api.set_window_size('desktop');
        document.getElementById('btn-adm-browser').onclick = () => window.pywebview.api.open_external();
        document.getElementById('btn-adm-push').onclick = async () => {
            const btn = document.getElementById('btn-adm-push');
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

        // Trigger reload to enable edit buttons on cards
        if (window.reloadMods) window.reloadMods();
    })();
    """
    window.evaluate_js(js_code)

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
    window.events.loaded += lambda: inject_advanced_editor(window)
    webview.start(debug=False)

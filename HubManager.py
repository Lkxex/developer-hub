import os
import sys
import json
import shutil
import threading
import subprocess
import webbrowser
import customtkinter as ctk
from tkinter import messagebox

# Set dark theme
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")
MANIFEST_PATH = os.path.join(PROJECTS_DIR, "index.json")


def load_manifest():
    if not os.path.exists(MANIFEST_PATH):
        return []
    try:
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("projects", [])
    except Exception as e:
        print(f"Error reading manifest: {e}")
        return []


def save_manifest(slugs):
    try:
        with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump({"projects": slugs}, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving manifest: {e}")
        return False


def load_project(slug):
    path = os.path.join(PROJECTS_DIR, slug, "project.json")
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading project {slug}: {e}")
        return None


def save_project(slug, data):
    proj_dir = os.path.join(PROJECTS_DIR, slug)
    os.makedirs(proj_dir, exist_ok=True)
    path = os.path.join(proj_dir, "project.json")
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving project {slug}: {e}")
        return False


class ProjectDialog(ctk.CTkToplevel):
    def __init__(self, parent, slug=None):
        super().__init__(parent)
        self.title("Proje Düzenle" if slug else "Yeni Proje Ekle")
        self.geometry("620x720")
        self.resizable(False, False)
        self.parent = parent
        self.slug = slug
        self.is_edit = slug is not None

        # Center dialog
        self.update_idletasks()
        x = parent.winfo_x() + (parent.winfo_width() - 620) // 2
        y = parent.winfo_y() + (parent.winfo_height() - 720) // 2
        self.geometry(f"+{max(0, x)}+{max(0, y)}")
        self.grab_set()

        self.init_ui()
        if self.is_edit:
            self.load_data()

    def init_ui(self):
        scroll = ctk.CTkScrollableFrame(self, width=580, height=640)
        scroll.pack(padx=15, pady=15, fill="both", expand=True)

        # Title / Slug
        ctk.CTkLabel(scroll, text="Proje Kimliği (Slug - İngilizce/küçük harf, örn: my-game):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_slug = ctk.CTkEntry(scroll, width=550)
        self.entry_slug.pack(anchor="w", pady=(0, 10))
        if self.is_edit:
            self.entry_slug.configure(state="disabled")

        ctk.CTkLabel(scroll, text="Proje Başlığı (Örn: PES 2021 Discord RPC):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_title = ctk.CTkEntry(scroll, width=550)
        self.entry_title.pack(anchor="w", pady=(0, 10))

        # Category & Type in one row
        cat_frame = ctk.CTkFrame(scroll, fg_color="transparent")
        cat_frame.pack(fill="x", pady=(0, 10))

        cat_sub1 = ctk.CTkFrame(cat_frame, fg_color="transparent")
        cat_sub1.pack(side="left", expand=True, fill="x", padx=(0, 5))
        ctk.CTkLabel(cat_sub1, text="Kategori:", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(0, 2))
        self.combo_cat = ctk.CTkComboBox(cat_sub1, values=["Tools", "Games", "Minecraft", "Mods", "Plugins", "Applications", "Other"])
        self.combo_cat.pack(fill="x")

        cat_sub2 = ctk.CTkFrame(cat_frame, fg_color="transparent")
        cat_sub2.pack(side="right", expand=True, fill="x", padx=(5, 0))
        ctk.CTkLabel(cat_sub2, text="Tür:", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(0, 2))
        self.combo_type = ctk.CTkComboBox(cat_sub2, values=["Application", "Game", "Mod", "Plugin", "Utility", "Web App"])
        self.combo_type.pack(fill="x")

        # Status & Version in one row
        status_frame = ctk.CTkFrame(scroll, fg_color="transparent")
        status_frame.pack(fill="x", pady=(0, 10))

        stat_sub1 = ctk.CTkFrame(status_frame, fg_color="transparent")
        stat_sub1.pack(side="left", expand=True, fill="x", padx=(0, 5))
        ctk.CTkLabel(stat_sub1, text="Durum:", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(0, 2))
        self.combo_status = ctk.CTkComboBox(stat_sub1, values=["Active", "In Development", "Archived"])
        self.combo_status.pack(fill="x")

        stat_sub2 = ctk.CTkFrame(status_frame, fg_color="transparent")
        stat_sub2.pack(side="right", expand=True, fill="x", padx=(5, 0))
        ctk.CTkLabel(stat_sub2, text="Sürüm (Örn: v1.0.0):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(0, 2))
        self.entry_version = ctk.CTkEntry(stat_sub2)
        self.entry_version.insert(0, "v1.0.0")
        self.entry_version.pack(fill="x")

        # Links
        ctk.CTkLabel(scroll, text="İndirme Linki (.zip / release URL):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_download = ctk.CTkEntry(scroll, width=550)
        self.entry_download.pack(anchor="w", pady=(0, 10))

        ctk.CTkLabel(scroll, text="GitHub Repo Linki:", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_github = ctk.CTkEntry(scroll, width=550)
        self.entry_github.pack(anchor="w", pady=(0, 10))

        # Tagline (TR & EN)
        ctk.CTkLabel(scroll, text="Kısa Açıklama (Türkçe):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_tagline_tr = ctk.CTkEntry(scroll, width=550)
        self.entry_tagline_tr.pack(anchor="w", pady=(0, 10))

        ctk.CTkLabel(scroll, text="Short Tagline (English):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_tagline_en = ctk.CTkEntry(scroll, width=550)
        self.entry_tagline_en.pack(anchor="w", pady=(0, 10))

        # Tags
        ctk.CTkLabel(scroll, text="Etiketler (Virgülle ayırın, örn: PES 2021, Sider, Discord):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.entry_tags = ctk.CTkEntry(scroll, width=550)
        self.entry_tags.pack(anchor="w", pady=(0, 10))

        # Detailed Summary
        ctk.CTkLabel(scroll, text="Detaylı Açıklama (Summary):", font=("Segoe UI", 12, "bold")).pack(anchor="w", pady=(5, 2))
        self.text_summary = ctk.CTkTextbox(scroll, width=550, height=80)
        self.text_summary.pack(anchor="w", pady=(0, 15))

        # Save Button
        btn_frame = ctk.CTkFrame(scroll, fg_color="transparent")
        btn_frame.pack(fill="x", pady=(10, 5))

        ctk.CTkButton(btn_frame, text="Kaydet", fg_color="#10b981", hover_color="#059669", font=("Segoe UI", 13, "bold"), command=self.save).pack(side="right", padx=(5, 0))
        ctk.CTkButton(btn_frame, text="İptal", fg_color="#374151", hover_color="#4b5563", command=self.destroy).pack(side="right", padx=(0, 5))

    def load_data(self):
        data = load_project(self.slug)
        if not data:
            return
        self.entry_slug.configure(state="normal")
        self.entry_slug.insert(0, data.get("id", self.slug))
        self.entry_slug.configure(state="disabled")

        self.entry_title.insert(0, data.get("title", ""))
        self.combo_cat.set(data.get("category", "Tools"))
        self.combo_type.set(data.get("type", "Application"))
        self.combo_status.set(data.get("status", "Active"))
        self.entry_version.delete(0, "end")
        self.entry_version.insert(0, data.get("version", "v1.0.0"))

        links = data.get("links", {})
        self.entry_download.insert(0, links.get("download", ""))
        self.entry_github.insert(0, links.get("github", ""))

        self.entry_tagline_tr.insert(0, data.get("tagline", ""))
        self.entry_tagline_en.insert(0, data.get("tagline_en", ""))

        tags = data.get("tags", [])
        self.entry_tags.insert(0, ", ".join(tags))

        self.text_summary.insert("1.0", data.get("summary", ""))

    def save(self):
        slug = self.entry_slug.get().strip().lower().replace(" ", "-")
        title = self.entry_title.get().strip()

        if not slug or not title:
            messagebox.showerror("Hata", "Proje Kimliği (Slug) ve Başlık zorunludur!")
            return

        tags = [t.strip() for t in self.entry_tags.get().split(",") if t.strip()]

        existing = load_project(slug) or {}
        existing["id"] = slug
        existing["title"] = title
        existing["category"] = self.combo_cat.get()
        existing["type"] = self.combo_type.get()
        existing["status"] = self.combo_status.get()
        existing["version"] = self.entry_version.get().strip()
        existing["tagline"] = self.entry_tagline_tr.get().strip()
        existing["tagline_en"] = self.entry_tagline_en.get().strip() or existing["tagline"]
        existing["summary"] = self.text_summary.get("1.0", "end-none").strip()
        existing["summary_en"] = existing.get("summary_en") or existing["summary"]
        existing["tags"] = tags
        existing["links"] = {
            "github": self.entry_github.get().strip(),
            "download": self.entry_download.get().strip(),
            "demo": existing.get("links", {}).get("demo", ""),
            "docs": existing.get("links", {}).get("docs", "")
        }

        # Downloads list
        dl_url = self.entry_download.get().strip()
        if dl_url:
            existing["downloads"] = [
                {
                    "name": f"{title} {existing['version']} (.zip)",
                    "filename": f"{slug}-{existing['version']}.zip",
                    "size": "Release",
                    "version": existing["version"],
                    "url": dl_url,
                    "isDirect": True
                }
            ]

        if not existing.get("coverImage"):
            existing["coverImage"] = "./assets/images/projects/pes2021-rpc-cover.svg"

        if not save_project(slug, existing):
            messagebox.showerror("Hata", "Proje dosyası kaydedilemedi!")
            return

        manifest = load_manifest()
        if slug not in manifest:
            manifest.append(slug)
            save_manifest(manifest)

        messagebox.showinfo("Başarılı", f"'{title}' projesi başarıyla kaydedildi!")
        self.parent.refresh_project_list()
        self.destroy()


class HubManagerApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Lkxex Developer Hub — Site & Proje Yöneticisi")
        self.geometry("860x640")
        self.minsize(780, 560)

        # Center Window
        self.update_idletasks()
        x = (self.winfo_screenwidth() - 860) // 2
        y = (self.winfo_screenheight() - 640) // 2
        self.geometry(f"+{x}+{y}")

        self.init_ui()
        self.refresh_project_list()

    def init_ui(self):
        # Header Frame
        header = ctk.CTkFrame(self, fg_color="#161b26", corner_radius=0, height=70)
        header.pack(fill="x")
        header.pack_propagate(False)

        title_lbl = ctk.CTkLabel(header, text="⚡ Developer Hub Yöneticisi", font=("Segoe UI", 20, "bold"), text_color="#f0f3f8")
        title_lbl.pack(side="left", padx=20, pady=15)

        # Action Buttons on Header
        btn_preview = ctk.CTkButton(header, text="🌐 Sitede Önizle", fg_color="#2563eb", hover_color="#1d4ed8", font=("Segoe UI", 12, "bold"), command=self.preview_site)
        btn_preview.pack(side="right", padx=(5, 20), pady=15)

        btn_publish = ctk.CTkButton(header, text="🚀 Değişiklikleri Canlıya Al (Push)", fg_color="#10b981", hover_color="#059669", font=("Segoe UI", 12, "bold"), command=self.publish_to_github)
        btn_publish.pack(side="right", padx=5, pady=15)

        # Main Layout
        content = ctk.CTkFrame(self, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=20, pady=15)

        # Toolbar
        toolbar = ctk.CTkFrame(content, fg_color="transparent")
        toolbar.pack(fill="x", pady=(0, 10))

        ctk.CTkLabel(toolbar, text="Mevcut Projeler:", font=("Segoe UI", 14, "bold")).pack(side="left")

        btn_add = ctk.CTkButton(toolbar, text="+ Yeni Proje Ekle", fg_color="#5865f2", hover_color="#4752c4", font=("Segoe UI", 12, "bold"), command=self.add_project)
        btn_add.pack(side="right")

        # Projects Scrollable Frame
        self.scroll_projects = ctk.CTkScrollableFrame(content, fg_color="#11141c", border_width=1, border_color="#1e2330", corner_radius=8)
        self.scroll_projects.pack(fill="both", expand=True)

        # Console / Status Log
        status_frame = ctk.CTkFrame(self, fg_color="#0d1117", height=90, corner_radius=0, border_width=1, border_color="#1e2330")
        status_frame.pack(fill="x", side="bottom")
        status_frame.pack_propagate(False)

        ctk.CTkLabel(status_frame, text="Sistem Günlüğü:", font=("Segoe UI", 11, "bold"), text_color="#94a3b8").pack(anchor="w", padx=15, pady=(5, 0))
        self.log_text = ctk.CTkLabel(status_frame, text="Hazır. Projelerinizi ekleyip 'Değişiklikleri Canlıya Al' butonuna basabilirsiniz.", font=("Consolas", 11), text_color="#38bdf8", anchor="w", justify="left")
        self.log_text.pack(anchor="w", padx=15, pady=(2, 5))

    def log(self, msg, color="#38bdf8"):
        self.log_text.configure(text=msg, text_color=color)

    def refresh_project_list(self):
        for widget in self.scroll_projects.winfo_children():
            widget.destroy()

        slugs = load_manifest()
        if not slugs:
            ctk.CTkLabel(self.scroll_projects, text="Henüz eklenmiş proje yok.", font=("Segoe UI", 13), text_color="#64748b").pack(pady=40)
            return

        for slug in slugs:
            proj = load_project(slug) or {}
            self.create_project_row(slug, proj)

    def create_project_row(self, slug, proj):
        row = ctk.CTkFrame(self.scroll_projects, fg_color="#161b26", corner_radius=6, border_width=1, border_color="#262e42")
        row.pack(fill="x", pady=5, padx=5)

        # Info Box
        info_frame = ctk.CTkFrame(row, fg_color="transparent")
        info_frame.pack(side="left", padx=15, pady=10, fill="both", expand=True)

        title = proj.get("title", slug)
        version = proj.get("version", "v1.0.0")
        category = proj.get("category", "Tools")
        status = proj.get("status", "Active")

        title_row = ctk.CTkFrame(info_frame, fg_color="transparent")
        title_row.pack(anchor="w")

        ctk.CTkLabel(title_row, text=title, font=("Segoe UI", 14, "bold"), text_color="#f0f3f8").pack(side="left", padx=(0, 8))
        ctk.CTkLabel(title_row, text=version, font=("Consolas", 11), text_color="#58a6ff").pack(side="left", padx=(0, 8))
        
        status_color = "#10b981" if status.lower() == "active" else "#f59e0b"
        ctk.CTkLabel(title_row, text=f"[{category} • {status}]", font=("Segoe UI", 11), text_color=status_color).pack(side="left")

        tagline = proj.get("tagline", "Açıklama yok.")
        ctk.CTkLabel(info_frame, text=tagline, font=("Segoe UI", 11), text_color="#94a3b8", anchor="w").pack(anchor="w", pady=(2, 0))

        # Buttons
        btns = ctk.CTkFrame(row, fg_color="transparent")
        btns.pack(side="right", padx=15, pady=10)

        ctk.CTkButton(btns, text="Düzenle", width=70, fg_color="#374151", hover_color="#4b5563", font=("Segoe UI", 11), command=lambda s=slug: self.edit_project(s)).pack(side="left", padx=3)
        ctk.CTkButton(btns, text="Sil", width=50, fg_color="#991b1b", hover_color="#b91c1c", font=("Segoe UI", 11), command=lambda s=slug: self.delete_project(s)).pack(side="left", padx=3)

    def add_project(self):
        ProjectDialog(self)

    def edit_project(self, slug):
        ProjectDialog(self, slug=slug)

    def delete_project(self, slug):
        if not messagebox.askyesno("Onay", f"'{slug}' projesini silmek istediğinize emin misiniz?"):
            return

        manifest = load_manifest()
        if slug in manifest:
            manifest.remove(slug)
            save_manifest(manifest)

        proj_dir = os.path.join(PROJECTS_DIR, slug)
        if os.path.exists(proj_dir):
            shutil.rmtree(proj_dir, ignore_errors=True)

        self.log(f"'{slug}' projesi silindi.", "#f43f5e")
        self.refresh_project_list()

    def preview_site(self):
        index_path = os.path.join(BASE_DIR, "index.html")
        webbrowser.open(f"file:///{index_path}")
        self.log("Site tarayıcınızda açıldı.")

    def publish_to_github(self):
        self.log("Değişiklikler GitHub'a gönderiliyor, lütfen bekleyin...", "#f59e0b")

        def run_git():
            try:
                subprocess.run(["git", "add", "."], cwd=BASE_DIR, check=True)
                # Commit if there are changes
                res = subprocess.run(["git", "commit", "-m", "update: Projects updated via Hub Manager"], cwd=BASE_DIR, capture_output=True, text=True)
                push_res = subprocess.run(["git", "push", "origin", "main"], cwd=BASE_DIR, capture_output=True, text=True)

                if push_res.returncode == 0:
                    self.after(0, lambda: self.log("✅ Değişiklikler başarıyla GitHub'a gönderildi! Birkaç saniyede canlıda.", "#10b981"))
                    self.after(0, lambda: messagebox.showinfo("Tebrikler", "Değişiklikler başarıyla GitHub'a gönderildi!"))
                else:
                    err_msg = push_res.stderr or push_res.stdout
                    self.after(0, lambda: self.log(f"Hata: {err_msg[:80]}", "#f43f5e"))
                    self.after(0, lambda: messagebox.showerror("Hata", f"GitHub'a yüklenemedi:\n{err_msg}"))
            except Exception as e:
                self.after(0, lambda: self.log(f"Hata: {e}", "#f43f5e"))
                self.after(0, lambda: messagebox.showerror("Hata", str(e)))

        threading.Thread(target=run_git, daemon=True).start()


if __name__ == "__main__":
    app = HubManagerApp()
    app.mainloop()

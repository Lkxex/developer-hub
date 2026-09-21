/**
 * Minimalist i18n Module (TR / EN)
 * Natural developer tone, zero AI fluff.
 */

const translations = {
  tr: {
    site_title: "Lkxex / Modlar & Projeler",
    header_subtitle: "Modlar & Araçlar",
    intro_title: "Selam, ben <span style=\"color: #5865F2;\">Lkxex</span>.",
    intro_desc: "Oyunlar için düşük seviyeli modlar, Sider eklentileri ve performans odaklı araçlar geliştiriyorum. İndirme bağlantılarına ve kurulum bilgilerine buradan ulaşabilirsiniz.",
    search_placeholder: "Mod veya etiket ara... (Örn: PES, Sider, RPC)",
    btn_download_zip: "İndir (.zip)",
    btn_github: "GitHub",
    btn_evoweb: "EvoWeb",
    btn_details_open: "⚙️ Kurulum & Detaylar",
    btn_details_close: "▲ Kapat",
    label_install: "Kurulum Satırı (sider.ini):",
    btn_copy: "Kopyala",
    btn_copied: "Kopyalandı!",
    label_hotkeys: "Kısayollar:",
    label_features: "Özellikler:",
    no_mods_found: "Aramanıza uygun mod bulunamadı.",
    footer_text: "Lkxex • Açık Kaynak & Doğrudan Dağıtım",
    // Editor modal strings
    modal_title_add: "➕ Yeni Mod Ekle",
    modal_title_edit: "✏️ Mod Düzenle",
    f_title: "Mod Başlığı:",
    f_version: "Sürüm (Örn: v1.0.11):",
    f_icon: "Küçük Resim / İkon Yolu (Örn: ./assets/images/projects/icon.png):",
    f_desc_tr: "Açıklama (Türkçe):",
    f_desc_en: "Açıklama (İngilizce):",
    f_download: "İndirme Linki (.zip):",
    f_github: "GitHub Depo Linki:",
    f_evoweb: "Forum / EvoWeb Linki (Opsiyonel):",
    f_install: "Kurulum Kodu (Örn: lua.module = \"...\"):",
    f_tags: "Etiketler (Virgülle ayırın):",
    btn_save: "💾 Kaydet",
    btn_cancel: "İptal",
    btn_delete: "🗑️ Bu Modu Sil"
  },
  en: {
    site_title: "Lkxex / Mods & Projects",
    header_subtitle: "Mods & Tools",
    intro_title: "Hey, I'm <span style=\"color: #5865F2;\">Lkxex</span>.",
    intro_desc: "I build low-level game mods, Sider modules, and performance-focused utilities. Releases, downloads, and setup instructions are available below.",
    search_placeholder: "Search mods or tags... (e.g., PES, Sider, RPC)",
    btn_download_zip: "Download (.zip)",
    btn_github: "GitHub",
    btn_evoweb: "EvoWeb",
    btn_details_open: "⚙️ Setup & Details",
    btn_details_close: "▲ Close",
    label_install: "Installation Line (sider.ini):",
    btn_copy: "Copy",
    btn_copied: "Copied!",
    label_hotkeys: "Hotkeys:",
    label_features: "Features:",
    no_mods_found: "No matching mods found.",
    footer_text: "Lkxex • Open Source & Direct Distribution",
    // Editor modal strings
    modal_title_add: "➕ Add New Mod",
    modal_title_edit: "✏️ Edit Mod",
    f_title: "Mod Title:",
    f_version: "Version (e.g., v1.0.11):",
    f_icon: "Thumbnail / Icon Path (e.g., ./assets/images/projects/icon.png):",
    f_desc_tr: "Description (Turkish):",
    f_desc_en: "Description (English):",
    f_download: "Download URL (.zip):",
    f_github: "GitHub Repo URL:",
    f_evoweb: "Forum / EvoWeb URL (Optional):",
    f_install: "Install Code (e.g., lua.module = \"...\"):",
    f_tags: "Tags (Comma-separated):",
    btn_save: "💾 Save",
    btn_cancel: "Cancel",
    btn_delete: "🗑️ Delete Mod"
  }
};

export function getLanguage() {
  const saved = localStorage.getItem('site_lang');
  if (saved === 'tr' || saved === 'en') return saved;
  const sysLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return sysLang.startsWith('tr') ? 'tr' : 'en';
}

export function setLanguage(lang) {
  if (lang === 'tr' || lang === 'en') {
    localStorage.setItem('site_lang', lang);
    applyLanguage(lang);
  }
}

export function t(key) {
  const lang = getLanguage();
  if (translations[lang] && translations[lang][key] !== undefined) {
    return translations[lang][key];
  }
  if (translations['en'] && translations['en'][key] !== undefined) {
    return translations['en'][key];
  }
  return key;
}

export function applyLanguage(lang) {
  const currentLang = lang || getLanguage();
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) {
      if (el.tagName === 'INPUT' && (el.type === 'search' || el.type === 'text')) {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    langBtn.title = currentLang === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç';
  }

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

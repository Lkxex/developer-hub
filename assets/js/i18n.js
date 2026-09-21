/**
 * Minimalist i18n Module (TR / EN)
 * Natural developer tone, zero AI fluff.
 */

const translations = {
  tr: {
    site_title: "Lkxex / Modlar & Projeler",
    header_subtitle: "Modlar & Araçlar",
    intro_title: "Selam, ben <span style=\"color: #5865F2;\">Lkxex</span>.",
    intro_desc: "Oyunlar için düşük seviyeli modlar, Sider eklentileri ve performans odaklı araçlar geliştiriyorum. Kendi projelerime ve oyun dünyasından öne çıkan popüler topluluk modlarına buradan ulaşabilirsiniz.",
    search_placeholder: "Mod, etiket veya oyun ara... (Örn: PES, Sider, Minecraft, RPC)",
    tab_all: "Tümü",
    tab_personal: "⚡ Kendi Modlarım",
    tab_community: "🌟 Popüler Topluluk Modları",
    badge_personal: "Geliştirici Projesi",
    badge_community: "Topluluk Tavsiyesi",
    label_developer: "Geliştirici:",
    label_platform: "Platform:",
    btn_visit_mod: "Mod Sayfasına Git ↗",
    btn_download_zip: "İndir (.zip)",
    btn_github: "GitHub",
    btn_evoweb: "EvoWeb",
    btn_details_open: "⚙️ Kurulum & Detaylar",
    btn_details_close: "▲ Kapat",
    label_install: "Kurulum Satırı (sider.ini):",
    btn_copy: "Kopyala",
    btn_copied: "Kopyalandı!",
    label_hotkeys: "Kısayollar:",
    label_features: "Özellikler & Detaylar:",
    no_mods_found: "Aramanıza veya seçtiğiniz sekmeye uygun mod bulunamadı.",
    footer_text: "Lkxex • Açık Kaynak & Doğrudan Dağıtım",
    // Editor modal strings
    modal_title_add: "➕ Yeni Mod Ekle",
    modal_title_edit: "✏️ Mod Düzenle",
    f_type: "Mod Türü:",
    f_type_personal: "Kendi Modum (Geliştirici)",
    f_type_community: "Popüler Topluluk Modu",
    f_author: "Geliştirici / Yazar:",
    f_platform: "Platform Adı (Örn: EvoWeb, Modrinth, CurseForge):",
    f_platform_url: "Mod Sayfası / İndirme URL:",
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
    intro_desc: "I build low-level game mods, Sider modules, and performance-focused utilities. Explore both my personal projects and curated popular community mods below.",
    search_placeholder: "Search mods, tags, or games... (e.g. PES, Sider, Minecraft, RPC)",
    tab_all: "All",
    tab_personal: "⚡ My Projects",
    tab_community: "🌟 Community Highlights",
    badge_personal: "Personal Project",
    badge_community: "Community Pick",
    label_developer: "Developer:",
    label_platform: "Platform:",
    btn_visit_mod: "Visit Mod Page ↗",
    btn_download_zip: "Download (.zip)",
    btn_github: "GitHub",
    btn_evoweb: "EvoWeb",
    btn_details_open: "⚙️ Setup & Details",
    btn_details_close: "▲ Close",
    label_install: "Installation Line (sider.ini):",
    btn_copy: "Copy",
    btn_copied: "Copied!",
    label_hotkeys: "Hotkeys:",
    label_features: "Features & Details:",
    no_mods_found: "No matching mods found for this search or filter.",
    footer_text: "Lkxex • Open Source & Direct Distribution",
    // Editor modal strings
    modal_title_add: "➕ Add New Mod",
    modal_title_edit: "✏️ Edit Mod",
    f_type: "Mod Type:",
    f_type_personal: "Personal Project (My Mod)",
    f_type_community: "Popular Community Mod",
    f_author: "Developer / Author:",
    f_platform: "Platform Name (e.g. EvoWeb, Modrinth, CurseForge):",
    f_platform_url: "Mod Page / Download URL:",
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

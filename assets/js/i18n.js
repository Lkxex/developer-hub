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
    search_placeholder: "Mod, etiket, oyun veya yazar ara... (Örn: PES, Sider, Minecraft, RPC)",
    tab_all: "Tümü",
    tab_personal: "⚡ Kendi Modlarım",
    tab_community: "🌟 Popüler Topluluk Modları",
    badge_personal: "Geliştirici Projesi",
    badge_community: "Topluluk Tavsiyesi",
    label_developer: "Geliştirici:",
    label_platform: "Platform:",
    label_version: "Sürüm:",
    label_last_updated: "Güncelleme:",
    label_requirements: "Gereksinimler:",
    label_steps: "Adım Adım Kurulum Rehberi:",
    label_links: "Platform & Topluluk Bağlantıları:",
    label_features: "Öne Çıkan Özellikler:",
    label_hotkeys: "Kısayollar & Kontroller:",
    btn_view_mod: "İncele & İndir ➔",
    btn_download_zip: "İndir (.zip)",
    btn_close_showcase: "Kapat",
    tab_overview: "📖 Genel Bakış",
    tab_install: "⚙️ Kurulum & Yapılandırma",
    tab_hotkeys: "⌨️ Kısayollar",
    label_install: "Kurulum Satırı (sider.ini / config):",
    btn_copy: "Kopyala",
    btn_copied: "Kopyalandı!",
    no_mods_found: "Aramanıza veya seçtiğiniz sekmeye uygun mod bulunamadı.",
    footer_text: "Lkxex • Açık Kaynak & Doğrudan Dağıtım",
    // Editor modal strings
    modal_title_add: "➕ Yeni Mod Ekle",
    modal_title_edit: "✏️ Mod Düzenle",
    f_type: "Mod Türü:",
    f_type_personal: "Kendi Modum (Geliştirici)",
    f_type_community: "Popüler Topluluk Modu",
    f_author: "Geliştirici / Yazar:",
    f_game: "Oyun Adı (Örn: eFootball PES 2021, Minecraft):",
    f_title: "Mod Başlığı:",
    f_version: "Sürüm (Örn: v1.0.11):",
    f_icon: "Küçük Resim / İkon Yolu (Örn: ./assets/images/projects/icon.png):",
    f_desc_tr: "Kısa Açıklama (Türkçe):",
    f_desc_en: "Kısa Açıklama (İngilizce):",
    f_overview_tr: "Detaylı Genel Bakış (Türkçe):",
    f_overview_en: "Detaylı Genel Bakış (İngilizce):",
    f_download: "İndirme Linki (.zip):",
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
    search_placeholder: "Search mods, tags, games, or authors... (e.g. PES, Sider, Minecraft, RPC)",
    tab_all: "All",
    tab_personal: "⚡ My Projects",
    tab_community: "🌟 Community Highlights",
    badge_personal: "Personal Project",
    badge_community: "Community Pick",
    label_developer: "Developer:",
    label_platform: "Platform:",
    label_version: "Version:",
    label_last_updated: "Updated:",
    label_requirements: "Requirements:",
    label_steps: "Step-by-Step Installation Guide:",
    label_links: "Platform & Community Links:",
    label_features: "Key Features:",
    label_hotkeys: "Controls & Hotkeys:",
    btn_view_mod: "View & Download ➔",
    btn_download_zip: "Download (.zip)",
    btn_close_showcase: "Close",
    tab_overview: "📖 Overview",
    tab_install: "⚙️ Installation & Setup",
    tab_hotkeys: "⌨️ Controls",
    label_install: "Installation Line (sider.ini / config):",
    btn_copy: "Copy",
    btn_copied: "Copied!",
    no_mods_found: "No matching mods found for this search or filter.",
    footer_text: "Lkxex • Open Source & Direct Distribution",
    // Editor modal strings
    modal_title_add: "➕ Add New Mod",
    modal_title_edit: "✏️ Edit Mod",
    f_type: "Mod Type:",
    f_type_personal: "Personal Project (My Mod)",
    f_type_community: "Popular Community Mod",
    f_author: "Developer / Author:",
    f_game: "Game Name (e.g. eFootball PES 2021, Minecraft):",
    f_title: "Mod Title:",
    f_version: "Version (e.g., v1.0.11):",
    f_icon: "Thumbnail / Icon Path (e.g., ./assets/images/projects/icon.png):",
    f_desc_tr: "Short Tagline (Turkish):",
    f_desc_en: "Short Tagline (English):",
    f_overview_tr: "Detailed Overview (Turkish):",
    f_overview_en: "Detailed Overview (English):",
    f_download: "Download URL (.zip):",
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

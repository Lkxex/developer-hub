/**
 * Internationalization (i18n) Module
 * Natural, developer-crafted bilingual dictionary (TR / EN)
 * Auto-detects system language with manual toggle option.
 */

const translations = {
  tr: {
    nav_home: "Ana Sayfa",
    nav_install: "Kurulum",
    nav_preview: "Önizleme",
    nav_controls: "Kısayollar",
    nav_all_projects: "Tüm Projeler",
    hero_badge: "v1.0.11 Çıktı",
    hero_title: "eFootball PES 2021 için Discord Rich Presence",
    hero_desc: "Oyun içi maç skorunu, takımları, uzatma dakikalarını ve gol anlarını Discord profilinizde canlı gösterir. Sider 7 ve doğrudan Windows Named Pipe (IPC) ile sıfır gecikme ve sıfır FPS kaybı.",
    btn_download_zip: "v1.0.11 İndir (.zip)",
    btn_view_github: "GitHub'da Gör",
    btn_evoweb: "EvoWeb Konusu",
    tab_preview: "Ekran & Önizleme",
    tab_install: "3 Adımda Hızlı Kurulum",
    tab_controls: "Kısayollar & Özellikler",
    tab_changelog: "Sürüm Notları",
    step1_title: "1. Arşivi İndirin",
    step1_desc: "En güncel v1.0.11 sürümünü (.zip) indirin ve içindeki dosyaları klasöre çıkartın.",
    step2_title: "2. Sider Modüllerine Kopyalayın",
    step2_desc: "discord_rpc.lua dosyasını ve mapping dosyalarını Sider 7 klasörünüzün içindeki modules/ dizinine atın.",
    step3_title: "3. sider.ini Dosyasına Ekleyin",
    step3_desc: "sider.ini dosyasını açıp lua.module bölümünün altına şu satırı ekleyin:",
    btn_copy: "Kopyala",
    btn_copied: "Kopyalandı!",
    ctrl_f5_title: "F5 Tuşu",
    ctrl_f5_desc: "Discord oyundan sonra açıldıysa tek tuşla bağlantıyı anında yeniler.",
    ctrl_pg_title: "PgUp / PgDn",
    ctrl_pg_desc: "Sider 7 arayüzündeki ayar menüsünde yukarı/aşağı gezinmenizi sağlar.",
    ctrl_del_title: "Delete Tuşu",
    ctrl_del_desc: "Seçili ayarı (Discord Butonu, Görsel Hata Ayıklama) Açık/Kapalı olarak değiştirir.",
    feat_zerogc_title: "Zero-GC (Sıfır Bellek Çöpü)",
    feat_zerogc_desc: "Önceden ayrılmış statik C bellek tamponları kullanır; maç esnasında oyun içi mikro takılma (stutter) yapmaz.",
    feat_ipc_title: "Doğrudan Win32 IPC",
    feat_ipc_desc: "Arka planda harici bir .exe çalıştırmaz, doğrudan Discord'un yerel pipe hattına bağlanır.",
    feat_patches_title: "Tüm Yamalarla Uyumlu",
    feat_patches_desc: "Football Life (FL24/FL25), SmokePatch, EvoWeb ve VirtuaRED ile kusursuz çalışır.",
    sec_projects_title: "Diğer Projeler & Araçlar",
    sec_projects_sub: "Geliştirdiğim diğer açık kaynaklı araçlar",
    footer_desc: "Lkxex - Bağımsız oyun modları, Sider eklentileri ve masaüstü yazılımları.",
    footer_rights: "Tüm hakları saklıdır."
  },
  en: {
    nav_home: "Home",
    nav_install: "Installation",
    nav_preview: "Preview",
    nav_controls: "Controls",
    nav_all_projects: "All Projects",
    hero_badge: "v1.0.11 Released",
    hero_title: "Discord Rich Presence for eFootball PES 2021",
    hero_desc: "Displays live match scores, teams, added time, and goal alerts directly on your Discord profile. Powered by Sider 7 and Win32 Named Pipe IPC with zero latency and zero FPS drop.",
    btn_download_zip: "Download v1.0.11 (.zip)",
    btn_view_github: "View on GitHub",
    btn_evoweb: "EvoWeb Thread",
    tab_preview: "Preview & Screens",
    tab_install: "Quick 3-Step Install",
    tab_controls: "Controls & Features",
    tab_changelog: "Changelog",
    step1_title: "1. Download Release",
    step1_desc: "Download the latest v1.0.11 release (.zip) and extract it to your PC.",
    step2_title: "2. Copy to Sider Modules",
    step2_desc: "Copy discord_rpc.lua and the mapping files into your Sider 7 modules/ directory.",
    step3_title: "3. Register in sider.ini",
    step3_desc: "Open sider.ini and add the following line under the lua.module section:",
    btn_copy: "Copy",
    btn_copied: "Copied!",
    ctrl_f5_title: "F5 Key",
    ctrl_f5_desc: "Instantly reconnects the IPC pipe if Discord was opened after launching the game.",
    ctrl_pg_title: "PgUp / PgDn",
    ctrl_pg_desc: "Navigate settings in the Sider 7 on-screen overlay menu.",
    ctrl_del_title: "Delete Key",
    ctrl_del_desc: "Toggles selected setting (Discord Button, Visual Debug) ON/OFF.",
    feat_zerogc_title: "Zero-GC Memory Design",
    feat_zerogc_desc: "Uses preallocated static C buffers so Lua never triggers garbage collection stutters during matches.",
    feat_ipc_title: "Direct Win32 IPC",
    feat_ipc_desc: "No third-party wrapper executables needed; talks directly to Discord's local pipe.",
    feat_patches_title: "Universal Patch Support",
    feat_patches_desc: "Fully compatible with Football Life (FL24/FL25), SmokePatch, EvoWeb, and VirtuaRED.",
    sec_projects_title: "Other Projects & Tools",
    sec_projects_sub: "Other open-source utilities and mods",
    footer_desc: "Lkxex - Independent game mods, Sider modules, and desktop utilities.",
    footer_rights: "All rights reserved."
  }
};

export function getLanguage() {
  const saved = localStorage.getItem('site_lang');
  if (saved === 'tr' || saved === 'en') {
    return saved;
  }
  const sysLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (sysLang.startsWith('tr')) {
    return 'tr';
  }
  return 'en';
}

export function setLanguage(lang) {
  if (lang === 'tr' || lang === 'en') {
    localStorage.setItem('site_lang', lang);
    applyLanguage(lang);
  }
}

export function t(key) {
  const lang = getLanguage();
  return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
}

export function applyLanguage(lang) {
  const currentLang = lang || getLanguage();
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) {
      if (el.tagName === 'INPUT' && el.type === 'search') {
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

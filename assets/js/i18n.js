/**
 * Internationalization (i18n) Module
 * Natural, developer-crafted bilingual dictionary (TR / EN)
 * Auto-detects system language with manual toggle option.
 */

const translations = {
  tr: {
    nav_home: "Ana Sayfa",
    nav_projects: "Projeler",
    nav_categories: "Kategoriler",
    nav_about: "Hakkımda",
    hero_status: "Aktif Geliştirici",
    hero_title: "Kişisel <span style=\"color: var(--accent-discord);\">Developer Hub</span> &amp; Proje Dağıtım Merkezi",
    hero_desc: "Selam, ben Lkxex. Geliştirdiğim oyunlar, Minecraft modları/eklentileri, Sider modülleri ve masaüstü araçlarının güncel sürümlerini, kaynak kodlarını ve doğrudan indirme bağlantılarını buradan paylaşıyorum.",
    hero_search_placeholder: "Proje, oyun, mod veya etiket ara... (Örn: PES, Sider, Discord, C#)",
    btn_explore: "Projeleri Keşfet",
    btn_github: "GitHub Profilim",
    sec_featured_title: "Öne Çıkan &amp; Son Yayınlanan Proje",
    sec_featured_sub: "Aktif olarak kullanılan amiral gemisi modülüm",
    sec_all_projects_title: "Tüm Projeler &amp; Araçlar",
    sec_all_projects_sub: "Oyunlar, modlar, eklentiler ve sistem yardımcıları",
    cat_all: "Tümü",
    cat_games: "Oyunlar",
    cat_minecraft: "Minecraft",
    cat_mods: "Modlar",
    cat_plugins: "Eklentiler",
    cat_tools: "Araçlar &amp; Programlar",
    btn_download_zip: "v1.0.11 İndir (.zip)",
    btn_view_github: "GitHub'da Gör",
    btn_evoweb: "EvoWeb Konusu",
    btn_details: "Detaylı İncele",
    tab_preview: "Ekran &amp; Önizleme",
    tab_install: "3 Adımda Hızlı Kurulum",
    tab_controls: "Kısayollar &amp; Özellikler",
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
    card_more_title: "Daha Fazla Proje Yolda",
    card_more_desc: "Yeni oyunlar, Minecraft eklentileri ve sistem araçları geliştirilmeye devam ediyor. Kod tabanı onlarca projeyi kaldıracak şekilde hazır.",
    sec_about_title: "Hakkımda",
    sec_about_desc: "Oyun modlama, bellek analizi (reverse-engineering) ve performans odaklı Windows araçları üzerine çalışan bağımsız bir geliştiriciyim. Projelerimde sıfır gecikme (zero-latency) ve sıfır bellek sızıntısına (Zero-GC) odaklanıyorum.",
    footer_desc: "Lkxex - Kişisel oyunlar, modlar, Sider eklentileri ve masaüstü yazılımları platformu.",
    footer_rights: "Tüm hakları saklıdır.",
    footer_static: "Açık Kaynak &amp; Doğrudan Dağıtım"
  },
  en: {
    nav_home: "Home",
    nav_projects: "Projects",
    nav_categories: "Categories",
    nav_about: "About",
    hero_status: "Active Developer",
    hero_title: "Personal <span style=\"color: var(--accent-discord);\">Developer Hub</span> &amp; Release Platform",
    hero_desc: "Hey, I'm Lkxex. This is my central hub where I publish independent games, Minecraft mods &amp; plugins, Sider modules, and desktop utilities with direct downloads and source code.",
    hero_search_placeholder: "Search projects, games, mods or tags... (e.g., PES, Sider, Discord, C#)",
    btn_explore: "Explore Projects",
    btn_github: "GitHub Profile",
    sec_featured_title: "Featured &amp; Latest Release",
    sec_featured_sub: "Actively maintained flagship module",
    sec_all_projects_title: "All Projects &amp; Tools",
    sec_all_projects_sub: "Games, mods, plugins, and system utilities",
    cat_all: "All",
    cat_games: "Games",
    cat_minecraft: "Minecraft",
    cat_mods: "Mods",
    cat_plugins: "Plugins",
    cat_tools: "Tools &amp; Apps",
    btn_download_zip: "Download v1.0.11 (.zip)",
    btn_view_github: "View on GitHub",
    btn_evoweb: "EvoWeb Thread",
    btn_details: "View Details",
    tab_preview: "Preview &amp; Screens",
    tab_install: "Quick 3-Step Install",
    tab_controls: "Controls &amp; Features",
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
    card_more_title: "More Projects on the Way",
    card_more_desc: "New games, Minecraft plugins, and desktop tools in active development. Built on an extensible architecture ready for dozens of releases.",
    sec_about_title: "About Me",
    sec_about_desc: "Independent developer working on game modding, reverse-engineering, and low-overhead desktop utilities. Focused on zero-latency IPC and zero-garbage-collection performance.",
    footer_desc: "Lkxex - Central distribution platform for personal games, mods, plugins, and software.",
    footer_rights: "All rights reserved.",
    footer_static: "Open Source &amp; Direct Distribution"
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

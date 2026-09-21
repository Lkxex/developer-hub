/**
 * Internationalization (i18n) Module
 * Authentic, human-crafted bilingual dictionary (TR / EN)
 * Auto-detects system language with manual toggle option.
 */

const translations = {
  tr: {
    // Navigation
    nav_home: "Ana Sayfa",
    nav_projects: "Projeler",
    nav_categories: "Kategoriler",
    nav_about: "Hakkımda",

    // Hero Section
    hero_title: "Selam, ben <span style=\"color: var(--accent-discord);\">Lkxex</span>.",
    hero_desc: "eFootball PES 2021 ve oyunlar için düşük seviyeli modlar, Sider eklentileri ve performans odaklı araçlar geliştiriyorum. Yayınladığım projelerin indirme bağlantılarına ve kaynak kodlarına buradan ulaşabilirsiniz.",
    hero_search_placeholder: "Proje, mod veya etiket ara... (Örn: PES, Sider, Discord, C#)",
    btn_explore: "Projeleri İncele",
    btn_github: "GitHub Profilim",

    // Projects Section
    sec_featured_title: "Öne Çıkan Proje",
    sec_featured_sub: "Aktif olarak geliştirilen ve kullanılan modülüm",
    sec_all_projects_title: "Tüm Projeler",
    sec_all_projects_sub: "Oyun modları, araçlar ve yazılımlar",
    projects_count_suffix: "proje",
    results_found: "proje bulundu",
    updated_prefix: "Güncellendi:",
    btn_inspect: "İncele",

    // Categories
    cat_all: "Tümü",
    cat_games: "Oyunlar",
    cat_minecraft: "Minecraft",
    cat_mods: "Modlar",
    cat_plugins: "Eklentiler",
    cat_tools: "Araçlar &amp; Programlar",
    all_categories: "Tüm Kategoriler",
    all_tab: "Tümü",
    all_types: "Tüm Türler",
    all_statuses: "Tüm Durumlar",
    all_tags: "Tüm Etiketler",

    // Catalog page
    catalog_title: "Proje Kataloğu",
    catalog_sub: "Geliştirilen tüm modlar, araçlar ve kütüphaneler",
    search_placeholder: "Proje adı veya etiket ara...",
    filter_category: "Kategori:",
    filter_type: "Tür:",
    filter_status: "Durum:",
    filter_tag: "Etiket:",
    filter_sort: "Sıralama:",
    sort_featured: "Öne Çıkanlar",
    sort_newest: "En Yeni",
    sort_updated: "Son Güncellenenler",
    sort_alpha: "Alfabetik (A-Z)",
    btn_reset: "Filtreleri Sıfırla",
    empty_title: "Proje Bulunamadı",
    empty_desc: "Seçtiğiniz filtrelere veya arama kriterine uygun bir proje bulunamadı.",
    empty_reset: "Filtreleri Temizle",

    // Project Detail Page
    btn_back_to_projects: "Tüm Projelere Dön",
    btn_download_releases: "İndirilenler & Sürümler",
    btn_run_demo: "Canlı Demo",
    btn_github_repo: "GitHub Deposu",
    btn_docs: "Dokümantasyon",
    proj_features: "Öne Çıkan Özellikler",
    proj_screenshots: "Ekran Görüntüleri",
    proj_install: "Kurulum & Kullanım",
    proj_reqs: "Gereksinimler",
    proj_downloads: "İndirme Bağlantıları",
    proj_changelog: "Sürüm Geçmişi (Changelog)",
    proj_about: "Proje Hakkında",
    proj_info: "Proje Bilgileri",
    proj_tags: "Etiketler",
    spec_category: "Kategori",
    spec_type: "Tür",
    spec_version: "Sürüm",
    spec_status: "Durum",
    spec_released: "Yayınlanma",
    spec_updated: "Son Güncelleme",
    btn_download: "İndir",

    // Fallback / Not Found
    not_found_title: "Proje Bulunamadı",
    not_found_desc: "Aradığınız proje mevcut değil veya kaldırılmış olabilir.",
    not_found_btn_catalog: "Tüm Projelere Göz At",
    not_found_btn_home: "Ana Sayfaya Dön",

    // PES 2021 RPC Spotlight
    btn_download_zip: "v1.0.11 İndir (.zip)",
    btn_view_github: "GitHub'da Gör",
    btn_evoweb: "EvoWeb Konusu",
    btn_details: "Detaylı İncele",
    tab_preview: "Önizleme & Ekran",
    tab_install: "Kurulum (3 Adım)",
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
    feat_zerogc_title: "Zero-GC (Sıfır FPS Düşüşü)",
    feat_zerogc_desc: "Önceden ayrılmış statik C bellek tamponları kullanır; maç esnasında oyun içi mikro takılma (stutter) yapmaz.",
    feat_ipc_title: "Doğrudan Win32 IPC",
    feat_ipc_desc: "Arka planda harici bir .exe çalıştırmaz, doğrudan Discord'un yerel pipe hattına bağlanır.",
    feat_patches_title: "Tüm Yamalarla Uyumlu",
    feat_patches_desc: "Football Life (FL24/FL25), SmokePatch, EvoWeb ve VirtuaRED ile kusursuz çalışır.",

    // About Section
    sec_about_title: "Hakkımda",
    sec_about_desc: "Oyun modlama, bellek analizi (reverse-engineering) ve Windows için performans odaklı araçlar geliştiriyorum. Projelerimde sıfır gecikme (zero-latency) ve sıfır bellek çöpü (Zero-GC) standartlarına odaklanıyorum.",

    // Footer
    footer_desc: "Lkxex - Oyun modları, Sider eklentileri ve masaüstü yazılımları.",
    footer_nav: "Menü",
    footer_links: "Bağlantılar",
    footer_rights: "Tüm hakları saklıdır.",
    footer_static: "Açık Kaynak & Doğrudan Dağıtım"
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_projects: "Projects",
    nav_categories: "Categories",
    nav_about: "About",

    // Hero Section
    hero_title: "Hey, I'm <span style=\"color: var(--accent-discord);\">Lkxex</span>.",
    hero_desc: "I develop low-level game mods, Sider modules, and performance-focused utilities for eFootball PES 2021 and other games. You can find direct releases, downloads, and source code here.",
    hero_search_placeholder: "Search projects, mods, or tags... (e.g., PES, Sider, Discord, C#)",
    btn_explore: "Explore Releases",
    btn_github: "GitHub Profile",

    // Projects Section
    sec_featured_title: "Featured Project",
    sec_featured_sub: "Actively maintained flagship module",
    sec_all_projects_title: "All Projects",
    sec_all_projects_sub: "Game mods, tools, and software",
    projects_count_suffix: "projects",
    results_found: "projects found",
    updated_prefix: "Updated:",
    btn_inspect: "View",

    // Categories
    cat_all: "All",
    cat_games: "Games",
    cat_minecraft: "Minecraft",
    cat_mods: "Mods",
    cat_plugins: "Plugins",
    cat_tools: "Tools &amp; Apps",
    all_categories: "All Categories",
    all_tab: "All",
    all_types: "All Types",
    all_statuses: "All Statuses",
    all_tags: "All Tags",

    // Catalog page
    catalog_title: "Project Catalog",
    catalog_sub: "All developed mods, tools, and libraries",
    search_placeholder: "Search project name or tag...",
    filter_category: "Category:",
    filter_type: "Type:",
    filter_status: "Status:",
    filter_tag: "Tag:",
    filter_sort: "Sort by:",
    sort_featured: "Featured",
    sort_newest: "Newest",
    sort_updated: "Recently Updated",
    sort_alpha: "Alphabetical (A-Z)",
    btn_reset: "Reset Filters",
    empty_title: "No Projects Found",
    empty_desc: "No projects match your current filters or search query.",
    empty_reset: "Clear Filters",

    // Project Detail Page
    btn_back_to_projects: "Back to All Projects",
    btn_download_releases: "Downloads & Releases",
    btn_run_demo: "Live Demo",
    btn_github_repo: "GitHub Repository",
    btn_docs: "Documentation",
    proj_features: "Key Features",
    proj_screenshots: "Screenshots",
    proj_install: "Installation & Setup",
    proj_reqs: "Requirements",
    proj_downloads: "Direct Downloads",
    proj_changelog: "Version History (Changelog)",
    proj_about: "About Project",
    proj_info: "Project Details",
    proj_tags: "Tags",
    spec_category: "Category",
    spec_type: "Type",
    spec_version: "Version",
    spec_status: "Status",
    spec_released: "Released",
    spec_updated: "Last Updated",
    btn_download: "Download",

    // Fallback / Not Found
    not_found_title: "Project Not Found",
    not_found_desc: "The project you are looking for does not exist or has been removed.",
    not_found_btn_catalog: "Browse All Projects",
    not_found_btn_home: "Back to Home",

    // PES 2021 RPC Spotlight
    btn_download_zip: "Download v1.0.11 (.zip)",
    btn_view_github: "View on GitHub",
    btn_evoweb: "EvoWeb Thread",
    btn_details: "View Details",
    tab_preview: "Preview & Screens",
    tab_install: "Install (3 Steps)",
    tab_controls: "Controls & Features",
    tab_changelog: "Changelog",
    step1_title: "1. Download Release",
    step1_desc: "Download the latest v1.0.11 release (.zip) and extract the archive.",
    step2_title: "2. Copy to Sider Modules",
    step2_desc: "Copy discord_rpc.lua and the mapping files into your Sider 7 modules/ folder.",
    step3_title: "3. Add to sider.ini",
    step3_desc: "Open sider.ini and add the following line under the lua.module section:",
    btn_copy: "Copy",
    btn_copied: "Copied!",
    ctrl_f5_title: "F5 Key",
    ctrl_f5_desc: "Instantly reconnects the IPC pipe if Discord was opened after launching the game.",
    ctrl_pg_title: "PgUp / PgDn",
    ctrl_pg_desc: "Navigate through the settings in the Sider 7 on-screen overlay menu.",
    ctrl_del_title: "Delete Key",
    ctrl_del_desc: "Toggles selected setting (Discord Button, Visual Debug) ON/OFF.",
    feat_zerogc_title: "Zero-GC Memory Design",
    feat_zerogc_desc: "Uses preallocated static C buffers so Lua never triggers garbage collection stutters during matches.",
    feat_ipc_title: "Direct Win32 IPC",
    feat_ipc_desc: "No third-party wrapper executables needed; talks directly to Discord's local pipe.",
    feat_patches_title: "Universal Patch Support",
    feat_patches_desc: "Fully compatible with Football Life (FL24/FL25), SmokePatch, EvoWeb, and VirtuaRED.",

    // About Section
    sec_about_title: "About Me",
    sec_about_desc: "Independent developer working on game modding, reverse-engineering, and low-overhead desktop utilities. Focused on zero-latency IPC and zero-garbage-collection performance.",

    // Footer
    footer_desc: "Lkxex - Game mods, Sider modules, and desktop utilities.",
    footer_nav: "Navigation",
    footer_links: "Links",
    footer_rights: "All rights reserved.",
    footer_static: "Open Source & Direct Distribution"
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
  if (translations[lang] && translations[lang][key] !== undefined) {
    return translations[lang][key];
  }
  if (translations['en'] && translations['en'][key] !== undefined) {
    return translations['en'][key];
  }
  // If key is not found, don't return raw ugly key if it has underscores
  return key.replace(/_/g, ' ');
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

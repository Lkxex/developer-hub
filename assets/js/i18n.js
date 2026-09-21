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
    hero_title: "Oyun modları, Sider modülleri ve <span style=\"color: var(--accent-discord);\">özel araçlar</span>.",
    hero_desc: "Selam, ben Lkxex. eFootball PES 2021 ve çeşitli oyunlar için geliştirdiğim modlar, doğrudan IPC eklentileri ve araçların güncel sürümlerini, kaynak kodlarını ve indirme bağlantılarını buradan paylaşıyorum.",
    hero_btn_explore: "Projeleri İncele",
    hero_btn_github: "GitHub Profilim",
    sec_featured_title: "Yayınlanan Projeler",
    sec_featured_sub: "Doğrudan indirilebilir ve kaynak kodu açık çalışmalarım",
    sec_cat_title: "Kategoriler",
    sec_cat_sub: "Çalışma alanlarına göre projeler",
    sec_recent_title: "Son Güncellemeler",
    sec_recent_sub: "En son sürüm ve yama alan projeler",
    sec_about_title: "Hakkımda",
    sec_about_desc: "Oyun modlama, bellek analizi ve Windows araçları üzerine çalışan bağımsız bir geliştiriciyim. PES 2021 için Sider 7 ve LuaJIT FFI kullanarak oyunun performansını (FPS) düşürmeyen, arka planda sıfır gecikmeyle çalışan doğrudan IPC çözümleri üretiyorum.",
    footer_desc: "Kişisel oyun modları, Sider eklentileri ve masaüstü yazılımları.",
    footer_nav: "Navigasyon",
    footer_links: "Bağlantılar",
    footer_rights: "Tüm hakları saklıdır.",
    footer_static: "Doğrudan İndirilebilir & Açık Kaynak",
    btn_inspect: "Detaylar & İndir",
    btn_see_all: "Tümünü Gör",
    btn_catalog: "Kataloğu İncele",
    btn_download: "İndir",
    btn_download_releases: "İndir / Sürümler",
    btn_run_demo: "Demoyu Çalıştır",
    btn_github_repo: "GitHub Reposu",
    btn_docs: "Dokümantasyon",
    btn_back_to_projects: "Tüm Projelere Dön",
    btn_reset: "Sıfırla",
    catalog_title: "Proje Kataloğu",
    catalog_sub: "Tüm araçlar, modlar ve yazılımlar",
    search_placeholder: "Proje adı veya etiket ara... (Örn: PES 2021, Discord, RPC, C#)",
    filter_category: "Kategori:",
    filter_type: "Tür:",
    filter_status: "Durum:",
    filter_tag: "Etiket:",
    filter_sort: "Sıralama:",
    all_categories: "Tüm Kategoriler",
    all_types: "Tüm Türler",
    all_statuses: "Tüm Durumlar",
    all_tags: "Tüm Etiketler",
    all_tab: "Tümü",
    sort_featured: "Öne Çıkanlar",
    sort_newest: "En Yeni",
    sort_updated: "Son Güncellenen",
    sort_alpha: "İsme Göre (A-Z)",
    results_found: "proje listelendi",
    empty_title: "Aramanızla eşleşen proje bulunamadı",
    empty_desc: "Farklı bir arama terimi veya filtre seçmeyi deneyin.",
    empty_reset: "Filtreleri Temizle",
    proj_about: "Proje Hakkında",
    proj_features: "Teknik Özellikler & Detaylar",
    proj_screenshots: "Önizleme & Ekran Görüntüleri",
    proj_install: "Kurulum Talimatları",
    proj_reqs: "Sistem ve Oyun Gereksinimleri",
    proj_downloads: "İndirme Dosyaları",
    proj_changelog: "Sürüm Geçmişi (Changelog)",
    proj_info: "Proje Bilgileri",
    proj_tags: "Etiketler",
    spec_category: "Kategori",
    spec_type: "Tür",
    spec_version: "Sürüm",
    spec_status: "Durum",
    spec_released: "İlk Yayın",
    spec_updated: "Son Güncelleme",
    not_found_title: "Proje Bulunamadı",
    not_found_desc: "Aradığınız proje mevcut değil veya kaldırılmış olabilir.",
    not_found_btn_catalog: "Tüm Projelere Göz At",
    not_found_btn_home: "Ana Sayfaya Dön",
    updated_prefix: "Güncellendi:",
    projects_count_suffix: "Proje"
  },
  en: {
    nav_home: "Home",
    nav_projects: "Projects",
    nav_categories: "Categories",
    nav_about: "About",
    hero_status: "Active Developer",
    hero_title: "Game mods, Sider modules, and <span style=\"color: var(--accent-discord);\">custom utilities</span>.",
    hero_desc: "Hey, I'm Lkxex. Here you'll find the latest releases, documentation, and downloads for my eFootball PES 2021 mods, direct IPC tools, and game utilities.",
    hero_btn_explore: "Explore Projects",
    hero_btn_github: "GitHub Profile",
    sec_featured_title: "Released Projects",
    sec_featured_sub: "Open-source and directly downloadable creations",
    sec_cat_title: "Categories",
    sec_cat_sub: "Projects grouped by platform and domain",
    sec_recent_title: "Recent Updates",
    sec_recent_sub: "Projects that recently received new patches",
    sec_about_title: "About Me",
    sec_about_desc: "Independent developer working on game modding, reverse-engineering, and lightweight Windows tools. Using Sider 7 and LuaJIT FFI to craft direct-IPC integrations that deliver real-time data without causing FPS drops or memory bloat.",
    footer_desc: "Personal game mods, Sider modules, and desktop utilities.",
    footer_nav: "Navigation",
    footer_links: "Links",
    footer_rights: "All rights reserved.",
    footer_static: "Direct Download & Open Source",
    btn_inspect: "Details & Download",
    btn_see_all: "View All",
    btn_catalog: "Browse Catalog",
    btn_download: "Download",
    btn_download_releases: "Download / Releases",
    btn_run_demo: "Run Demo",
    btn_github_repo: "GitHub Repository",
    btn_docs: "Documentation",
    btn_back_to_projects: "Back to All Projects",
    btn_reset: "Reset",
    catalog_title: "Project Catalog",
    catalog_sub: "Browse all tools, mods, and utilities",
    search_placeholder: "Search by title or tag... (e.g., PES 2021, Discord, RPC, C#)",
    filter_category: "Category:",
    filter_type: "Type:",
    filter_status: "Status:",
    filter_tag: "Tag:",
    filter_sort: "Sort by:",
    all_categories: "All Categories",
    all_types: "All Types",
    all_statuses: "All Statuses",
    all_tags: "All Tags",
    all_tab: "All",
    sort_featured: "Featured",
    sort_newest: "Newest First",
    sort_updated: "Recently Updated",
    sort_alpha: "Alphabetical (A-Z)",
    results_found: "projects listed",
    empty_title: "No projects match your search",
    empty_desc: "Try searching for a different keyword or resetting your filters.",
    empty_reset: "Clear Filters",
    proj_about: "About the Project",
    proj_features: "Features & Architecture",
    proj_screenshots: "Preview & Screenshots",
    proj_install: "Installation Guide",
    proj_reqs: "System & Game Requirements",
    proj_downloads: "Downloads & Releases",
    proj_changelog: "Version Changelog",
    proj_info: "Project Overview",
    proj_tags: "Tags",
    spec_category: "Category",
    spec_type: "Type",
    spec_version: "Version",
    spec_status: "Status",
    spec_released: "Released",
    spec_updated: "Updated",
    not_found_title: "Project Not Found",
    not_found_desc: "The requested project does not exist or has been removed.",
    not_found_btn_catalog: "Browse All Projects",
    not_found_btn_home: "Back to Home",
    updated_prefix: "Updated:",
    projects_count_suffix: "Projects"
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

/**
 * Internationalization (i18n) Module
 * Detects system language (tr or en) with manual override support.
 */

const translations = {
  tr: {
    nav_home: "Ana Sayfa",
    nav_projects: "Tüm Projeler",
    nav_categories: "Kategoriler",
    nav_about: "Hakkımda",
    hero_status: "● Aktif Geliştirici",
    hero_title: "Oyun, mod, eklenti ve yazılım projeleri için <span style=\"color: var(--accent-emerald);\">merkezi dağıtım platformu</span>.",
    hero_desc: "Geliştirdiğim bağımsız oyunlar, eklentiler, masaüstü araçları ve açık kaynak yazılımların güncel sürümlerine, kaynak kodlarına ve indirme bağlantılarına buradan ulaşabilirsiniz.",
    hero_btn_explore: "Projeleri Keşfet",
    hero_btn_github: "GitHub'da Takip Et",
    sec_featured_title: "Öne Çıkan Projeler",
    sec_featured_sub: "Aktif olarak geliştirilen ve en son yayınlanan çalışmalarım",
    sec_cat_title: "Proje Kategorileri",
    sec_cat_sub: "Geliştirme alanlarına göre ayrılmış projeler",
    sec_recent_title: "Son Güncellenenler",
    sec_recent_sub: "En son sürüm veya yama alan projeler",
    sec_about_title: "Geliştirici Hakkında",
    sec_about_desc: "Ben oyunlar, masaüstü yardımcı araçları, eklentiler ve açık kaynak yazılımlar üreten bağımsız bir yazılım geliştiricisiyim. Bu platform, geliştirdiğim projelerin en güncel sürümlerini, kullanım kılavuzlarını ve doğrudan indirme bağlantılarını güvenli ve şeffaf bir şekilde paylaşmak amacıyla oluşturuldu.",
    footer_desc: "Kişisel oyun, mod, plugin ve araç projelerimin merkezi dağıtım ve dokümantasyon platformu.",
    footer_nav: "Navigasyon",
    footer_links: "Bağlantılar",
    footer_rights: "Tüm hakları saklıdır.",
    footer_static: "Statik & Açık Kaynak Dağıtım",
    btn_inspect: "İncele",
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
    catalog_sub: "Yazılımlar, araçlar ve projeler arasında arama ve filtreleme yapın",
    search_placeholder: "Proje adı, açıklama veya etiket ara... (Örn: PES 2021, Discord, RPC, C#)",
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
    sort_newest: "En Yeni Eklenenler",
    sort_updated: "Son Güncellenenler",
    sort_alpha: "Alfabetik (A-Z)",
    results_found: "proje bulundu",
    empty_title: "Aramanızla eşleşen proje bulunamadı",
    empty_desc: "Arama kriterlerinizi veya seçtiğiniz filtreleri sıfırlayarak tekrar deneyebilirsiniz.",
    empty_reset: "Filtreleri Sıfırla",
    proj_about: "Proje Hakkında",
    proj_features: "Öne Çıkan Özellikler",
    proj_screenshots: "Ekran Görüntüleri",
    proj_install: "Kurulum ve Kullanım",
    proj_reqs: "Sistem / Çalışma Gereksinimleri",
    proj_downloads: "İndirme Bağlantıları ve Dosyalar",
    proj_changelog: "Sürüm Geçmişi (Changelog)",
    proj_info: "Proje Bilgileri",
    proj_tags: "Etiketler",
    spec_category: "Kategori",
    spec_type: "Tür",
    spec_version: "Son Sürüm",
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
    nav_projects: "All Projects",
    nav_categories: "Categories",
    nav_about: "About Me",
    hero_status: "● Active Developer",
    hero_title: "Central distribution hub for <span style=\"color: var(--accent-emerald);\">games, mods, tools and software</span>.",
    hero_desc: "Access the latest releases, source code, documentation, and direct download links for my independent games, applications, desktop utilities, and open-source projects.",
    hero_btn_explore: "Explore Projects",
    hero_btn_github: "Follow on GitHub",
    sec_featured_title: "Featured Projects",
    sec_featured_sub: "Actively maintained and highlighted creations",
    sec_cat_title: "Project Categories",
    sec_cat_sub: "Browse projects by development domains",
    sec_recent_title: "Recently Updated",
    sec_recent_sub: "Projects that recently received updates or patches",
    sec_about_title: "About Developer",
    sec_about_desc: "I am an independent developer building games, desktop tools, plugins, and open-source software. This platform serves as a central, safe, and transparent hub to share releases, documentation, and downloads directly.",
    footer_desc: "Central distribution and documentation platform for personal games, mods, plugins, and tools.",
    footer_nav: "Navigation",
    footer_links: "Links",
    footer_rights: "All rights reserved.",
    footer_static: "Static & Open Source Distribution",
    btn_inspect: "View Details",
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
    catalog_sub: "Search and filter through tools, apps, and software projects",
    search_placeholder: "Search title, description or tag... (e.g., PES 2021, Discord, RPC, C#)",
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
    results_found: "projects found",
    empty_title: "No projects match your criteria",
    empty_desc: "Try resetting your search query or adjusting your filters.",
    empty_reset: "Reset Filters",
    proj_about: "About Project",
    proj_features: "Key Features",
    proj_screenshots: "Screenshots",
    proj_install: "Installation & Usage",
    proj_reqs: "System / Runtime Requirements",
    proj_downloads: "Downloads & Releases",
    proj_changelog: "Changelog & Version History",
    proj_info: "Project Information",
    proj_tags: "Tags",
    spec_category: "Category",
    spec_type: "Type",
    spec_version: "Latest Version",
    spec_status: "Status",
    spec_released: "Released",
    spec_updated: "Updated",
    not_found_title: "Project Not Found",
    not_found_desc: "The requested project does not exist or has been moved.",
    not_found_btn_catalog: "Browse All Projects",
    not_found_btn_home: "Back to Home",
    updated_prefix: "Updated:",
    projects_count_suffix: "Projects"
  }
};

/**
 * Returns user language ('tr' or 'en')
 * 1. Checks localStorage if user manually chose
 * 2. Checks browser system language (navigator.language)
 */
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

/**
 * Applies translations to all elements with data-i18n attribute
 */
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

  // Update language toggle button text
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
    langBtn.title = currentLang === 'tr' ? 'Switch to English' : 'Türkçe\'ye Geç';
  }

  // Dispatch event for dynamic content
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

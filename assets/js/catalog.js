/**
 * Catalog Controller (projects.html)
 * Handles client-side search, multi-faceted filtering, tag filtering, and sorting.
 */

import { loadAllProjects, getCategoryCounts, getTypeCounts } from './data-loader.js';
import { initCommonUI, createProjectCardHTML, escapeHTML } from './app.js';

let allProjects = [];

const state = {
  searchQuery: '',
  category: 'all',
  type: 'all',
  status: 'all',
  tag: 'all',
  sortBy: 'featured'
};

export async function initCatalogPage() {
  initCommonUI();

  const grid = document.getElementById('catalog-projects-grid');
  const searchInput = document.getElementById('search-input');
  const categorySelect = document.getElementById('category-filter');
  const typeSelect = document.getElementById('type-filter');
  const statusSelect = document.getElementById('status-filter');
  const sortSelect = document.getElementById('sort-filter');
  const tagSelect = document.getElementById('tag-filter');
  const categoryTabsContainer = document.getElementById('category-tabs');
  const resetBtn = document.getElementById('reset-filters-btn');
  const resultsCountEl = document.getElementById('results-count');

  try {
    allProjects = await loadAllProjects();

    // Read initial filters from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('category')) state.category = urlParams.get('category');
    if (urlParams.has('type')) state.type = urlParams.get('type');
    if (urlParams.has('status')) state.status = urlParams.get('status');
    if (urlParams.has('tag')) state.tag = urlParams.get('tag');
    if (urlParams.has('q')) state.searchQuery = urlParams.get('q');
    if (urlParams.has('sort')) state.sortBy = urlParams.get('sort');

    // Populate Category Dropdown and Tabs
    populateCategoryOptions(categorySelect, categoryTabsContainer);
    populateTypeOptions(typeSelect);
    populateTagOptions(tagSelect);

    // Synchronize UI elements with state
    if (searchInput) searchInput.value = state.searchQuery;
    if (categorySelect) categorySelect.value = state.category;
    if (typeSelect) typeSelect.value = state.type;
    if (statusSelect) statusSelect.value = state.status;
    if (sortSelect) sortSelect.value = state.sortBy;
    if (tagSelect) tagSelect.value = state.tag;

    // Event Listeners
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        updateURL();
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        setCategory(e.target.value, categoryTabsContainer, categorySelect);
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        state.type = e.target.value;
        updateURL();
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        state.status = e.target.value;
        updateURL();
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    if (tagSelect) {
      tagSelect.addEventListener('change', (e) => {
        state.tag = e.target.value;
        updateURL();
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        updateURL();
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetAllFilters(searchInput, categorySelect, typeSelect, statusSelect, tagSelect, sortSelect, categoryTabsContainer);
        renderFilteredProjects(grid, resultsCountEl);
      });
    }

    // Initial render
    renderFilteredProjects(grid, resultsCountEl);

  } catch (err) {
    console.error('Error initializing catalog page:', err);
    if (grid) {
      grid.innerHTML = '<div class="empty-state"><p>Projeler yüklenirken hata oluştu.</p></div>';
    }
  }
}

function setCategory(cat, tabsContainer, selectEl) {
  state.category = cat;
  if (selectEl) selectEl.value = cat;

  if (tabsContainer) {
    const tabs = tabsContainer.querySelectorAll('.category-tab-btn');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-category') === cat) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  updateURL();
}

function populateCategoryOptions(selectEl, tabsContainer) {
  const counts = getCategoryCounts(allProjects);
  const categories = Object.keys(counts).sort();

  if (selectEl) {
    selectEl.innerHTML = '<option value="all">Tüm Kategoriler</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = `${cat} (${counts[cat]})`;
      selectEl.appendChild(opt);
    });
  }

  if (tabsContainer) {
    let tabsHTML = `<button type="button" class="category-tab-btn ${state.category === 'all' ? 'active' : ''}" data-category="all">Tümü</button>`;
    categories.forEach(cat => {
      const isActive = state.category.toLowerCase() === cat.toLowerCase();
      tabsHTML += `<button type="button" class="category-tab-btn ${isActive ? 'active' : ''}" data-category="${escapeHTML(cat)}">${escapeHTML(cat)} <span style="opacity:0.7">(${counts[cat]})</span></button>`;
    });
    tabsContainer.innerHTML = tabsHTML;

    tabsContainer.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setCategory(btn.getAttribute('data-category'), tabsContainer, selectEl);
        const grid = document.getElementById('catalog-projects-grid');
        const countEl = document.getElementById('results-count');
        renderFilteredProjects(grid, countEl);
      });
    });
  }
}

function populateTypeOptions(selectEl) {
  if (!selectEl) return;
  const counts = getTypeCounts(allProjects);
  const types = Object.keys(counts).sort();

  selectEl.innerHTML = '<option value="all">Tüm Türler</option>';
  types.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = `${type} (${counts[type]})`;
    selectEl.appendChild(opt);
  });
}

function populateTagOptions(selectEl) {
  if (!selectEl) return;
  const tagSet = new Set();
  allProjects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  const tags = Array.from(tagSet).sort();

  selectEl.innerHTML = '<option value="all">Tüm Etiketler</option>';
  tags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    selectEl.appendChild(opt);
  });
}

function renderFilteredProjects(grid, countEl) {
  if (!grid) return;

  let filtered = allProjects.filter(project => {
    // 1. Search Query
    if (state.searchQuery) {
      const q = state.searchQuery;
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchTagline = project.tagline.toLowerCase().includes(q);
      const matchSummary = project.summary.toLowerCase().includes(q);
      const matchTags = project.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchTagline && !matchSummary && !matchTags) {
        return false;
      }
    }

    // 2. Category
    if (state.category !== 'all') {
      if (project.category.toLowerCase() !== state.category.toLowerCase()) {
        return false;
      }
    }

    // 3. Type
    if (state.type !== 'all') {
      if (project.type.toLowerCase() !== state.type.toLowerCase()) {
        return false;
      }
    }

    // 4. Status
    if (state.status !== 'all') {
      if (project.status.toLowerCase() !== state.status.toLowerCase()) {
        return false;
      }
    }

    // 5. Tag
    if (state.tag !== 'all') {
      if (!project.tags.some(t => t.toLowerCase() === state.tag.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (state.sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
    }
    if (state.sortBy === 'newest') {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    }
    if (state.sortBy === 'updated') {
      return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime();
    }
    if (state.sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Update count
  if (countEl) {
    countEl.textContent = `${filtered.length} proje bulundu`;
  }

  // Render Grid or Empty State
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3 class="empty-state-title">Aramanızla eşleşen proje bulunamadı</h3>
        <p class="empty-state-text">Arama kriterlerinizi veya seçtiğiniz filtreleri sıfırlayarak tekrar deneyebilirsiniz.</p>
        <button type="button" class="btn btn-secondary" id="empty-state-reset-btn">Filtreleri Sıfırla</button>
      </div>
    `;

    const emptyReset = document.getElementById('empty-state-reset-btn');
    if (emptyReset) {
      emptyReset.addEventListener('click', () => {
        const searchInput = document.getElementById('search-input');
        const categorySelect = document.getElementById('category-filter');
        const typeSelect = document.getElementById('type-filter');
        const statusSelect = document.getElementById('status-filter');
        const tagSelect = document.getElementById('tag-filter');
        const sortSelect = document.getElementById('sort-filter');
        const categoryTabsContainer = document.getElementById('category-tabs');
        resetAllFilters(searchInput, categorySelect, typeSelect, statusSelect, tagSelect, sortSelect, categoryTabsContainer);
        renderFilteredProjects(grid, countEl);
      });
    }
  } else {
    grid.innerHTML = filtered.map(p => createProjectCardHTML(p)).join('');
  }
}

function resetAllFilters(searchInput, catSelect, typeSelect, statusSelect, tagSelect, sortSelect, tabsContainer) {
  state.searchQuery = '';
  state.category = 'all';
  state.type = 'all';
  state.status = 'all';
  state.tag = 'all';
  state.sortBy = 'featured';

  if (searchInput) searchInput.value = '';
  if (catSelect) catSelect.value = 'all';
  if (typeSelect) typeSelect.value = 'all';
  if (statusSelect) statusSelect.value = 'all';
  if (tagSelect) tagSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'featured';

  if (tabsContainer) {
    const tabs = tabsContainer.querySelectorAll('.category-tab-btn');
    tabs.forEach(t => {
      if (t.getAttribute('data-category') === 'all') {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  }

  updateURL();
}

function updateURL() {
  const params = new URLSearchParams();
  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.category !== 'all') params.set('category', state.category);
  if (state.type !== 'all') params.set('type', state.type);
  if (state.status !== 'all') params.set('status', state.status);
  if (state.tag !== 'all') params.set('tag', state.tag);
  if (state.sortBy !== 'featured') params.set('sort', state.sortBy);

  const queryString = params.toString();
  const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}

/**
 * Main Application Script
 * Handles global interactions, navigation, i18n, and index page rendering.
 */

import { loadAllProjects, getCategoryCounts } from './data-loader.js';
import { applyLanguage, getLanguage, setLanguage, t } from './i18n.js';

/**
 * Initialize common layout behaviors
 */
export function initCommonUI() {
  // Apply language based on system or preference
  applyLanguage();

  // Language toggle button
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = getLanguage();
      setLanguage(current === 'tr' ? 'en' : 'tr');
    });
  }

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Update footer year dynamically
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Generates HTML for a project card with i18n support
 * @param {Object} project
 * @returns {string} HTML string
 */
export function createProjectCardHTML(project) {
  const lang = getLanguage();
  const statusClass = 
    project.status.toLowerCase() === 'active' ? 'badge-status-active' :
    project.status.toLowerCase() === 'in development' ? 'badge-status-indev' : 'badge-status-archived';

  const tagsHTML = project.tags.slice(0, 4).map(tag => 
    `<span class="tag-pill">${escapeHTML(tag)}</span>`
  ).join('');

  const demoBadge = project.isDemoPlaceholder 
    ? `<span class="badge badge-demo" title="Demo / Example">Demo / Örnek</span>` 
    : '';

  const githubBtn = project.links.github 
    ? `<a href="${escapeHTML(project.links.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline" aria-label="${escapeHTML(project.title)} GitHub reposu" title="GitHub">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      </a>`
    : '';

  const tagline = (lang === 'en' && project.tagline_en) ? project.tagline_en : project.tagline;

  return `
    <article class="project-card" data-id="${escapeHTML(project.id)}">
      <div class="card-media">
        <img src="${escapeHTML(project.coverImage)}" alt="${escapeHTML(project.title)} cover" loading="lazy" />
        <div class="card-badges-top">
          <span class="badge badge-category">${escapeHTML(project.category)}</span>
          <span class="badge badge-type">${escapeHTML(project.type)}</span>
          ${demoBadge}
        </div>
        <div class="card-version-top">
          <span class="badge badge-version">${escapeHTML(project.version)}</span>
        </div>
      </div>
      <div class="card-content">
        <div class="card-title-row">
          <h3 class="card-title">
            <a href="project.html?id=${encodeURIComponent(project.id)}">${escapeHTML(project.title)}</a>
          </h3>
          <span class="badge badge-status ${statusClass}">${escapeHTML(project.status)}</span>
        </div>
        <p class="card-tagline">${escapeHTML(tagline)}</p>
        <div class="card-tags">
          ${tagsHTML}
        </div>
      </div>
      <div class="card-footer">
        <span class="card-meta-date" title="${t('updated_prefix')} ${escapeHTML(project.updatedDate)}">
          ${t('updated_prefix')} ${escapeHTML(project.updatedDate)}
        </span>
        <div class="card-actions">
          ${githubBtn}
          <a href="project.html?id=${encodeURIComponent(project.id)}" class="btn btn-sm btn-primary">
            ${t('btn_inspect')}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Escapes HTML characters to prevent XSS
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Controller for Index Page (index.html)
 */
export async function initIndexPage() {
  initCommonUI();

  const featuredGrid = document.getElementById('featured-projects-grid');
  const recentGrid = document.getElementById('recent-projects-grid');
  const categoryGrid = document.getElementById('category-cards-grid');
  const totalCountEl = document.getElementById('total-projects-count');

  async function renderIndex() {
    try {
      const projects = await loadAllProjects();

      if (totalCountEl) {
        totalCountEl.textContent = `${projects.length} ${t('projects_count_suffix')}`;
      }

      // 1. Featured projects
      if (featuredGrid) {
        const featured = projects.filter(p => p.featured);
        const displayProjects = featured.length > 0 ? featured : projects;
        featuredGrid.innerHTML = displayProjects.map(p => createProjectCardHTML(p)).join('');
      }

      // 2. Categories with count
      if (categoryGrid) {
        const categoryCounts = getCategoryCounts(projects);
        const categoryIcons = {
          'Games': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4m-2-2v4m10-2h.01m-3-2h.01"/></svg>',
          'Minecraft': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
          'Tools': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
          'Applications': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
          'Other': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>'
        };

        const categories = Object.keys(categoryCounts);
        categoryGrid.innerHTML = categories.map(cat => {
          const count = categoryCounts[cat] || 0;
          const icon = categoryIcons[cat] || categoryIcons['Other'];
          return `
            <a href="projects.html?category=${encodeURIComponent(cat)}" class="category-card" title="${escapeHTML(cat)}">
              <div class="category-card-icon">${icon}</div>
              <div class="category-card-title">${escapeHTML(cat)}</div>
              <div class="category-card-count">${count} ${t('projects_count_suffix')}</div>
            </a>
          `;
        }).join('');
      }

      // 3. Recently updated projects
      if (recentGrid) {
        const sortedByUpdate = [...projects].sort((a, b) => 
          new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
        );
        recentGrid.innerHTML = sortedByUpdate.slice(0, 3).map(p => createProjectCardHTML(p)).join('');
      }

    } catch (err) {
      console.error('Error rendering index page:', err);
    }
  }

  // Re-render when language changes
  window.addEventListener('languageChanged', renderIndex);

  await renderIndex();
}

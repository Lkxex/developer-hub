/**
 * Project Detail Page Controller (project.html)
 * Loads project metadata by ?id=slug query parameter and renders rich sections with i18n support.
 */

import { getProjectById } from './data-loader.js';
import { initCommonUI, escapeHTML } from './app.js';
import { getLanguage, t } from './i18n.js';

let currentProject = null;

export async function initProjectViewPage() {
  initCommonUI();

  const container = document.getElementById('project-detail-container');
  const notFoundContainer = document.getElementById('project-not-found');

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    showNotFound(container, notFoundContainer, t('not_found_desc'));
    return;
  }

  try {
    currentProject = await getProjectById(projectId);

    if (!currentProject) {
      showNotFound(container, notFoundContainer, `"${escapeHTML(projectId)}" — ${t('not_found_desc')}`);
      return;
    }

    renderCurrent();

    window.addEventListener('languageChanged', () => {
      if (currentProject) renderCurrent();
    });

  } catch (err) {
    console.error('Error rendering project view:', err);
    showNotFound(container, notFoundContainer, t('not_found_desc'));
  }
}

function renderCurrent() {
  const container = document.getElementById('project-detail-container');
  const notFoundContainer = document.getElementById('project-not-found');
  const lang = getLanguage();

  document.title = `${currentProject.title} - Developer Hub`;
  const metaDesc = document.querySelector('meta[name="description"]');
  const tagline = (lang === 'en' && currentProject.tagline_en) ? currentProject.tagline_en : currentProject.tagline;
  if (metaDesc) {
    metaDesc.setAttribute('content', tagline || currentProject.title);
  }

  renderProjectDetail(currentProject, container, lang);
  initLightbox();
}

function showNotFound(detailEl, notFoundEl, message) {
  if (detailEl) detailEl.style.display = 'none';
  if (notFoundEl) {
    notFoundEl.style.display = 'block';
    const msgEl = notFoundEl.querySelector('.not-found-message');
    if (msgEl) msgEl.textContent = message;
  }
}

function renderProjectDetail(project, container, lang) {
  if (!container) return;
  container.style.display = 'block';

  const statusClass = 
    project.status.toLowerCase() === 'active' ? 'badge-status-active' :
    project.status.toLowerCase() === 'in development' ? 'badge-status-indev' : 'badge-status-archived';

  const demoBadge = project.isDemoPlaceholder 
    ? `<span class="badge badge-demo">Demo / Example</span>` 
    : '';

  const tagsHTML = project.tags.map(t => 
    `<a href="projects.html?tag=${encodeURIComponent(t)}" class="tag-pill">${escapeHTML(t)}</a>`
  ).join('');

  // Hero Actions
  const actionButtons = [];
  if (project.links.download) {
    actionButtons.push(`
      <a href="${escapeHTML(project.links.download)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${t('btn_download_releases')}
      </a>
    `);
  }
  if (project.links.demo) {
    actionButtons.push(`
      <a href="${escapeHTML(project.links.demo)}" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        ${t('btn_run_demo')}
      </a>
    `);
  }
  if (project.links.github) {
    actionButtons.push(`
      <a href="${escapeHTML(project.links.github)}" class="btn btn-github" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        ${t('btn_github_repo')}
      </a>
    `);
  }
  if (project.links.docs) {
    actionButtons.push(`
      <a href="${escapeHTML(project.links.docs)}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        ${t('btn_docs')}
      </a>
    `);
  }

  // Localized texts
  const tagline = (lang === 'en' && project.tagline_en) ? project.tagline_en : project.tagline;
  const summary = (lang === 'en' && project.summary_en) ? project.summary_en : project.summary;
  const features = (lang === 'en' && project.features_en) ? project.features_en : project.features;
  const installation = (lang === 'en' && project.installation_en) ? project.installation_en : project.installation;
  const requirements = (lang === 'en' && project.requirements_en) ? project.requirements_en : project.requirements;

  // Features list
  const featuresHTML = features && features.length > 0 ? `
    <div class="project-section-box">
      <h2 class="project-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        ${t('proj_features')}
      </h2>
      <ul class="features-list">
        ${features.map(f => `
          <li class="feature-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${escapeHTML(f)}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  ` : '';

  // Screenshots gallery
  const screenshotsHTML = project.screenshots && project.screenshots.length > 0 ? `
    <div class="project-section-box">
      <h2 class="project-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        ${t('proj_screenshots')}
      </h2>
      <div class="screenshots-grid">
        ${project.screenshots.map((s, idx) => {
          const caption = (lang === 'en' && s.caption_en) ? s.caption_en : (s.caption || '');
          return `
            <div class="screenshot-card" data-src="${escapeHTML(s.url)}" data-caption="${escapeHTML(caption)}" role="button" tabindex="0" aria-label="Zoom screenshot">
              <img src="${escapeHTML(s.url)}" alt="${escapeHTML(caption || `${project.title} screenshot ${idx + 1}`)}" loading="lazy" />
              ${caption ? `<div class="screenshot-caption">${escapeHTML(caption)}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  // Installation instructions
  const installationHTML = installation ? `
    <div class="project-section-box">
      <h2 class="project-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
        ${t('proj_install')}
      </h2>
      <pre class="code-box">${escapeHTML(installation)}</pre>
    </div>
  ` : '';

  // Requirements
  const reqKeys = Object.keys(requirements || {});
  const requirementsHTML = reqKeys.length > 0 ? `
    <div class="project-section-box">
      <h2 class="project-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        ${t('proj_reqs')}
      </h2>
      <div class="requirements-grid">
        ${reqKeys.map(k => `
          <div class="requirement-item">
            <div class="requirement-label">${escapeHTML(k)}</div>
            <div class="requirement-val">${escapeHTML(requirements[k])}</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Downloads Table
  const downloadsHTML = project.downloads && project.downloads.length > 0 ? `
    <div class="project-section-box" id="downloads-section">
      <h2 class="project-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        ${t('proj_downloads')}
      </h2>
      <div class="downloads-list">
        ${project.downloads.map(d => `
          <div class="download-item-card">
            <div class="download-info">
              <span class="download-name">${escapeHTML(d.name)}</span>
              <span class="download-meta">${escapeHTML(d.filename || '')} • ${escapeHTML(d.size || '')} • ${t('spec_version')}: ${escapeHTML(d.version || project.version)}</span>
            </div>
            <a href="${escapeHTML(d.url)}" class="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">
              ${t('btn_download')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Changelog
  const changelogHTML = project.changelog && project.changelog.length > 0 ? `
    <div class="project-section-box">
      <h2 class="project-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${t('proj_changelog')}
      </h2>
      <div class="changelog-timeline">
        ${project.changelog.map(c => {
          const changes = (lang === 'en' && c.changes_en) ? c.changes_en : (c.changes || []);
          return `
            <div class="changelog-entry">
              <div class="changelog-header">
                <span class="changelog-version">${escapeHTML(c.version)}</span>
                <span class="changelog-date">${escapeHTML(c.date)}</span>
              </div>
              <ul class="changelog-list">
                ${changes.map(ch => `<li>${escapeHTML(ch)}</li>`).join('')}
              </ul>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  // Assemble full HTML
  container.innerHTML = `
    <!-- Project Hero -->
    <header class="project-hero">
      <div class="project-hero-grid">
        <div class="project-hero-content">
          <div class="project-hero-badges">
            <span class="badge badge-category">${escapeHTML(project.category)}</span>
            <span class="badge badge-type">${escapeHTML(project.type)}</span>
            <span class="badge badge-status ${statusClass}">${escapeHTML(project.status)}</span>
            <span class="badge badge-version">${escapeHTML(project.version)}</span>
            ${demoBadge}
          </div>
          <h1 class="project-hero-title">${escapeHTML(project.title)}</h1>
          <p class="project-hero-tagline">${escapeHTML(tagline)}</p>
          <div class="project-hero-actions">
            ${actionButtons.join('')}
          </div>
        </div>
        <div class="project-hero-media">
          <img src="${escapeHTML(project.coverImage)}" alt="${escapeHTML(project.title)} cover" />
        </div>
      </div>
    </header>

    <!-- Main Content Layout -->
    <div class="project-layout">
      <!-- Main Left Column -->
      <div class="project-main-col">
        <!-- Overview / Summary -->
        <div class="project-section-box">
          <h2 class="project-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            ${t('proj_about')}
          </h2>
          <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary);">${escapeHTML(summary)}</p>
        </div>

        ${featuresHTML}
        ${screenshotsHTML}
        ${installationHTML}
        ${requirementsHTML}
        ${downloadsHTML}
        ${changelogHTML}
      </div>

      <!-- Sidebar Right Column -->
      <aside class="project-sidebar-col">
        <!-- Quick Specs Box -->
        <div class="project-section-box">
          <h3 class="project-section-title" style="font-size: 1.05rem;">${t('proj_info')}</h3>
          <div class="sidebar-specs-list">
            <div class="sidebar-spec-row">
              <span class="sidebar-spec-label">${t('spec_category')}</span>
              <span class="sidebar-spec-value">${escapeHTML(project.category)}</span>
            </div>
            <div class="sidebar-spec-row">
              <span class="sidebar-spec-label">${t('spec_type')}</span>
              <span class="sidebar-spec-value">${escapeHTML(project.type)}</span>
            </div>
            <div class="sidebar-spec-row">
              <span class="sidebar-spec-label">${t('spec_version')}</span>
              <span class="sidebar-spec-value">${escapeHTML(project.version)}</span>
            </div>
            <div class="sidebar-spec-row">
              <span class="sidebar-spec-label">${t('spec_status')}</span>
              <span class="sidebar-spec-value">${escapeHTML(project.status)}</span>
            </div>
            <div class="sidebar-spec-row">
              <span class="sidebar-spec-label">${t('spec_released')}</span>
              <span class="sidebar-spec-value">${escapeHTML(project.releaseDate)}</span>
            </div>
            <div class="sidebar-spec-row">
              <span class="sidebar-spec-label">${t('spec_updated')}</span>
              <span class="sidebar-spec-value">${escapeHTML(project.updatedDate)}</span>
            </div>
          </div>
        </div>

        <!-- Tags Box -->
        <div class="project-section-box">
          <h3 class="project-section-title" style="font-size: 1.05rem;">${t('proj_tags')}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${tagsHTML}
          </div>
        </div>

        <!-- Back to Catalog Link -->
        <a href="projects.html" class="btn btn-outline" style="width: 100%;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          ${t('btn_back_to_projects')}
        </a>
      </aside>
    </div>
  `;
}

function initLightbox() {
  const cards = document.querySelectorAll('.screenshot-card');
  const modal = document.getElementById('screenshot-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');

  if (!modal || !modalImg) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-src');
      const caption = card.getAttribute('data-caption') || '';
      modalImg.src = src;
      if (modalCaption) modalCaption.textContent = caption;
      modal.classList.add('active');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

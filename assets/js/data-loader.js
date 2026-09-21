/**
 * Data Loader Module
 * Loads project manifests and individual project JSON configurations.
 * Fully compatible with GitHub Pages relative paths.
 */

let cachedProjects = null;

/**
 * Calculates the relative base path dynamically to guarantee compatibility
 * with both root (username.github.io) and repository paths (username.github.io/repo-name/).
 */
function getBasePath() {
  // Since index.html, projects.html, and project.html are at the root,
  // relative path to projects/ is always './projects/'
  return './projects/';
}

/**
 * Fetches all projects by reading projects/index.json and each project's project.json
 * @returns {Promise<Array<Object>>} List of all loaded project objects
 */
export async function loadAllProjects() {
  if (cachedProjects) {
    return cachedProjects;
  }

  const basePath = getBasePath();
  const indexUrl = `${basePath}index.json`;

  try {
    const indexResponse = await fetch(indexUrl);
    if (!indexResponse.ok) {
      throw new Error(`Failed to load ${indexUrl}: ${indexResponse.status} ${indexResponse.statusText}`);
    }

    const indexData = await indexResponse.json();
    const slugs = Array.isArray(indexData) ? indexData : (indexData.projects || []);

    if (!slugs.length) {
      cachedProjects = [];
      return [];
    }

    // Fetch all project JSON files in parallel
    const projectPromises = slugs.map(async (slug) => {
      const projectUrl = `${basePath}${slug}/project.json`;
      try {
        const res = await fetch(projectUrl);
        if (!res.ok) {
          console.warn(`[DataLoader] Could not load project "${slug}" from ${projectUrl}: ${res.status}`);
          return null;
        }
        const data = await res.json();
        // Ensure id is set to slug if missing
        if (!data.id) data.id = slug;
        return normalizeProjectData(data, slug);
      } catch (err) {
        console.warn(`[DataLoader] Error parsing project.json for "${slug}":`, err);
        return null;
      }
    });

    const results = await Promise.allSettled(projectPromises);
    const validProjects = results
      .filter((r) => r.status === 'fulfilled' && r.value !== null)
      .map((r) => r.value);

    cachedProjects = validProjects;
    return validProjects;
  } catch (err) {
    console.error('[DataLoader] Fatal error loading project index:', err);
    return [];
  }
}

/**
 * Normalizes project schema with sensible defaults
 */
function normalizeProjectData(p, slug) {
  return {
    id: p.id || slug,
    title: p.title || 'İsimsiz Proje',
    tagline: p.tagline || '',
    category: p.category || 'Other',
    type: p.type || 'Software',
    status: p.status || 'Active',
    version: p.version || 'v1.0.0',
    featured: Boolean(p.featured),
    isDemoPlaceholder: Boolean(p.isDemoPlaceholder),
    releaseDate: p.releaseDate || '2025-01-01',
    updatedDate: p.updatedDate || p.releaseDate || '2025-01-01',
    tags: Array.isArray(p.tags) ? p.tags : [],
    coverImage: p.coverImage || './assets/images/projects/placeholder-cover.svg',
    links: {
      github: p.links?.github || '',
      download: p.links?.download || '',
      demo: p.links?.demo || '',
      docs: p.links?.docs || ''
    },
    summary: p.summary || p.tagline || '',
    features: Array.isArray(p.features) ? p.features : [],
    requirements: p.requirements || {},
    screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
    installation: p.installation || '',
    downloads: Array.isArray(p.downloads) ? p.downloads : [],
    changelog: Array.isArray(p.changelog) ? p.changelog : []
  };
}

/**
 * Gets a single project by its ID/slug
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(id) {
  if (!id) return null;
  const all = await loadAllProjects();
  return all.find((p) => p.id.toLowerCase() === id.toLowerCase()) || null;
}

/**
 * Gets all unique categories with counts
 */
export function getCategoryCounts(projects) {
  const counts = {};
  for (const p of projects) {
    const cat = p.category || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

/**
 * Gets all unique types with counts
 */
export function getTypeCounts(projects) {
  const counts = {};
  for (const p of projects) {
    const type = p.type || 'Other';
    counts[type] = (counts[type] || 0) + 1;
  }
  return counts;
}

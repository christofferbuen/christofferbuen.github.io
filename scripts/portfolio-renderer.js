/**
 * Portfolio Renderer
 * Dynamically renders portfolio content from portfolioData
 */

function renderPortfolio(data = portfolioData) {
  const main = document.querySelector('.main') || createMainContainer();

  // Clear existing content (keep structure)
  const content = main.querySelector('.portfolio-content') || document.createElement('div');
  content.className = 'portfolio-content';
  content.innerHTML = '';

  // Header section
  const header = document.createElement('header');
  header.className = 'portfolio-header';
  header.innerHTML = `
    <h1>${escapeHtml(data.name)}</h1>
    <p class="subtitle">${escapeHtml(data.title)}</p>
    <p class="bio">${escapeHtml(data.bio)}</p>
    <nav class="social-links">
      ${data.social
        .map(
          (link) =>
            `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.name)}</a>`
        )
        .join(' ')}
    </nav>
  `;
  content.appendChild(header);

  // Projects section
  const projectsSection = document.createElement('section');
  projectsSection.className = 'projects-section';
  projectsSection.innerHTML = '<h2>Projects</h2>';

  const projectsGrid = document.createElement('div');
  projectsGrid.className = 'projects';

  data.projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <h3><a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.title)}</a></h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="project-tags">
        ${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  projectsSection.appendChild(projectsGrid);
  content.appendChild(projectsSection);

  // Footer
  const footer = document.createElement('footer');
  footer.innerHTML = `<p>© ${new Date().getFullYear()} ${escapeHtml(data.name)}. Built with retrocomputing vibes.</p>`;
  content.appendChild(footer);

  if (!main.querySelector('.portfolio-content')) {
    main.appendChild(content);
  }
}

function createMainContainer() {
  const main = document.createElement('main');
  main.className = 'main';
  main.setAttribute('role', 'main');
  document.body.appendChild(main);
  return main;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPortfolio);
} else {
  renderPortfolio();
}

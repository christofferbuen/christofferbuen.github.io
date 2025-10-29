/**
 * Portfolio Projects Configuration
 * Easy to update with your own projects
 * 
 * @module PortfolioData
 */

/**
 * Portfolio data object containing personal information and projects
 * @typedef {Object} PortfolioData
 * @property {string} name - Your full name
 * @property {string} title - Your job title or role
 * @property {string} bio - A brief biography
 * @property {Array<{name: string, url: string}>} social - Social media links
 * @property {Array<{title: string, description: string, tags: string[], url: string}>} projects - Portfolio projects
 */
const portfolioData = {
  name: 'Your Name',
  title: 'Security & Systems Engineer',
  bio: 'Building detection systems and security tools with Python, Go, and a passion for clean code.',
  social: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Email', url: 'mailto:you@example.com' },
  ],
  projects: [
    {
      title: 'Project Two',
      description: 'Brief description of your second project goes here.',
      tags: ['Tag1', 'Tag2', 'Tag3'],
      url: '#',
    },
    {
      title: 'Project Three',
      description: 'Add more projects by editing portfolioData in scripts/portfolio-data.js',
      tags: ['Tag1', 'Tag2'],
      url: '#',
    },
  ],
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = portfolioData;
}

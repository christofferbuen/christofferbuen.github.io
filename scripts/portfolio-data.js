/**
 * Portfolio Projects Configuration
 * Easy to update with your own projects
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

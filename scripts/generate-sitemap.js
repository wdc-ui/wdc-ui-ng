const fs = require('fs');

const baseUrl = 'https://ui.ng.wdcoders.com';
const routes = [
  '',
  '/docs/avatars',
  '/docs/buttons',
  '/docs/breadcrumb',
  '/docs/badges',
  '/docs/tabs',
  '/docs/cards',
  '/docs/spinner',
  '/docs/accordion',
  '/docs/dropdown-menu',
  '/docs/navbar',
  '/docs/text-input',
  '/docs/checkbox-input',
  '/docs/radio-input',
  '/docs/textarea-input',
  '/docs/select-input',
  '/docs/date-picker',
  '/docs/table',
  '/docs/pagination',
  '/docs/toast',
  '/docs/drawer',
  '/docs/modal',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`,
    )
    .join('')}
</urlset>`;

// Build ke baad browser folder mein write karein
fs.writeFileSync('dist/wdc-ui-ng/browser/sitemap.xml', sitemap);
console.log('✅ Sitemap generated successfully!');

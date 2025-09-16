import { NextApiRequest, NextApiResponse } from 'next';

const DOMAIN = 'https://devtools-hub.com';

const staticPages = [
  '',
  '/api-code-generator',
  '/graphql-query-generator', 
  '/docker-compose-generator',
  '/github-actions-generator',
  '/kubernetes-yaml-generator'
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((page) => {
      const url = `${DOMAIN}${page}`;
      const lastmod = new Date().toISOString().split('T')[0];
      const priority = page === '' ? '1.0' : '0.8';
      
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
}
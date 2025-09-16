import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const robots = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://devtools-hub.com/sitemap.xml

# Disallow crawling of API routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();
}
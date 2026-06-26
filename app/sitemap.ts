import { MetadataRoute } from 'next';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hidden-mandate.vercel.app';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: BASE_URL + '/divination', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: BASE_URL + '/meihua', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: BASE_URL + '/xiaoliuren', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: BASE_URL + '/history', lastModified: new Date(), changeFrequency: 'never', priority: 0.3 },
  ];
}

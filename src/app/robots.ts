/**
 * Generates robots.txt for search engine crawlers
 * Accessible at: /robots.txt
 */
export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnault-janvier.fr';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/*/admin/',      // Block admin in all locales
                    '/login/',
                    '/*/login/',      // Block login in all locales
                    '/api/',          // Block API routes
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

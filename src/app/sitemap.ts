import { createClient } from '@/lib/supabase/server';

/**
 * Generates dynamic sitemap for the Arnault Janvier portfolio site
 * Includes all public pages and published projects in all locales (fr, en, es)
 *
 * Accessible at: /sitemap.xml
 */
export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnault-janvier.fr';
    const locales = ['fr', 'en', 'es'];
    const defaultLocale = 'fr';

    const sitemap: Array<{
        url: string;
        lastModified: Date;
        changeFrequency: 'weekly' | 'monthly';
        priority: number;
    }> = [];

    // Fetch all published projects from Supabase
    const supabase = createClient();
    const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false }) as { data: Array<{ slug: string; updated_at?: string; published_at?: string }> | null };

    // Static pages configuration
    const staticPages = [
        { path: '', changeFrequency: 'weekly' as const, priority: 1.0 }, // Home
        { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
        { path: '/gallery', changeFrequency: 'weekly' as const, priority: 0.9 },
        { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
    ];

    // Add static pages for each locale
    for (const page of staticPages) {
        for (const locale of locales) {
            const path = locale === defaultLocale ? page.path : `/${locale}${page.path}`;
            const url = `${baseUrl}${path || '/'}`;

            sitemap.push({
                url,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
            });
        }
    }

    // Add project pages for each locale
    if (projects && projects.length > 0) {
        for (const project of projects) {
            const lastModified = project.updated_at
                ? new Date(project.updated_at)
                : project.published_at
                ? new Date(project.published_at)
                : new Date();

            for (const locale of locales) {
                const path = locale === defaultLocale
                    ? `/gallery/${project.slug}`
                    : `/${locale}/gallery/${project.slug}`;
                const url = `${baseUrl}${path}`;

                sitemap.push({
                    url,
                    lastModified,
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        }
    }

    return sitemap;
}

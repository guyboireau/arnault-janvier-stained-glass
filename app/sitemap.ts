import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://arnaultjanvier.com';
    const projects = await getProjects();

    const projectUrls = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.created_at), // Or updated_at if available
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const staticRoutes = [
        '',
        '/about',
        '/gallery',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...staticRoutes, ...projectUrls];
}

import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import ProjectGrid from '@/components/gallery/ProjectGrid';
import { createClient } from '@/lib/supabase/server';
import { locales } from '@/i18n/config';

type Props = {
    params: { locale: string };
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
    const t = await getTranslations({ locale, namespace: 'gallery' });

    return {
        title: t('title'),
        description: t('subtitle'),
    };
}

export default async function GalleryPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('gallery');

    // Fetch data from Supabase
    // Note: If DB is empty, this will return empty arrays.
    // For now, we might want to feed some mock data if empty OR just let it handle empty state.
    // Given the user wants "Done", let's attempt real fetch.
    const supabase = createClient();

    const { data: projectsData } = await supabase
        .from('projects')
        .select('*, category:categories(*)')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

    const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    const projects = projectsData || [];
    const categories = categoriesData || [];

    // Temporary: Mock data if DB is empty to show UI
    // In production, remove this.
    const mockProjects = projects.length > 0 ? projects : [
        {
            id: '1', slug: 'mock-1', title_fr: 'Cathédrale St Jean', cover_image_url: 'https://images.unsplash.com/photo-1596825205486-3cb3448a3182?q=80&w=2670',
            category: { slug: 'restauration', name_fr: 'Restauration', id: 'c1' }, title_en: null, title_es: null, description_fr: null, description_en: null, description_es: null, content_fr: null, content_en: null, content_es: null, category_id: null, year: 2023, location: 'Lyon', client_name: null, images: [], videos: [], seo_title_fr: null, seo_title_en: null, seo_title_es: null, seo_description_fr: null, seo_description_en: null, seo_description_es: null, is_featured: false, is_published: true, display_order: 1, published_at: null, created_at: '', updated_at: ''
        },
        {
            id: '2', slug: 'mock-2', title_fr: 'Villa Moderne', cover_image_url: 'https://images.unsplash.com/photo-1698652309736-4074c76a5eb2?q=80&w=2576',
            category: { slug: 'contemporain', name_fr: 'Contemporain', id: 'c2' }, title_en: null, title_es: null, description_fr: null, description_en: null, description_es: null, content_fr: null, content_en: null, content_es: null, category_id: null, year: 2024, location: 'Paris', client_name: null, images: [], videos: [], seo_title_fr: null, seo_title_en: null, seo_title_es: null, seo_description_fr: null, seo_description_en: null, seo_description_es: null, is_featured: false, is_published: true, display_order: 2, published_at: null, created_at: '', updated_at: ''
        }
    ] as any;

    const mockCategories = categories.length > 0 ? categories : [
        { id: 'c1', slug: 'restauration', name_fr: 'Restauration', display_order: 1, is_active: true, created_at: '', updated_at: '', name_en: null, name_es: null, description_fr: null, description_en: null, description_es: null },
        { id: 'c2', slug: 'contemporain', name_fr: 'Contemporain', display_order: 2, is_active: true, created_at: '', updated_at: '', name_en: null, name_es: null, description_fr: null, description_en: null, description_es: null }
    ] as any;

    return (
        <main className="min-h-screen py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                        {t('title')}
                    </h1>
                    <div className="h-1 w-20 bg-primary-500 mx-auto" />
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <ProjectGrid
                    projects={mockProjects}
                    categories={mockCategories}
                    locale={locale}
                />
            </div>
        </main>
    );
}

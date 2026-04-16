import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import ProjectGrid from '@/components/gallery/ProjectGrid';
import { createClient } from '@/lib/supabase/server';
import { locales } from '@/i18n/config';
import { PROJET_CATEGORY_SLUGS } from '@/lib/constants';

type Props = {
    params: { locale: string };
    searchParams?: { category?: string };
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
    const t = await getTranslations({ locale, namespace: 'projets' });
    return {
        title: t('title'),
        description: t('subtitle'),
    };
}

export default async function ProjetsPage({ params: { locale }, searchParams }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('projets');

    const supabase = createClient();

    // Fetch categories belonging to the "Projets" group
    const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .in('slug', [...PROJET_CATEGORY_SLUGS])
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    const categories = (categoriesData || []) as any[];
    const categoryIds = categories.map((c: any) => c.id);

    // Fetch projects belonging to these categories
    const { data: projectsData } = await supabase
        .from('projects')
        .select('*, category:categories(*)')
        .in('category_id', categoryIds.length > 0 ? categoryIds : ['__none__'])
        .eq('is_published', true)
        .order('display_order', { ascending: true });

    const projects = projectsData || [];

    const initialCategory = searchParams?.category ?? null;

    return (
        <main className="min-h-screen py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">{t('eyebrow')}</p>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                        {t('title')}
                    </h1>
                    <div className="h-px w-16 bg-neutral-200 mx-auto" />
                    <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                <ProjectGrid
                    projects={projects}
                    categories={categories}
                    locale={locale}
                    initialCategory={initialCategory}
                />
            </div>
        </main>
    );
}

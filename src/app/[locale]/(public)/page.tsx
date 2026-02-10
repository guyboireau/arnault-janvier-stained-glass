import { getLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CallToAction from '@/components/home/CallToAction';
import InstagramFeedAuto from '@/components/social/InstagramFeedAuto';
import { createClient } from '@/lib/supabase/server';
import type { Locale } from '@/i18n/config';

export default async function HomePage() {
    const locale = await getLocale() as Locale;
    const supabase = createClient();

    // Fetch featured projects from Supabase
    const { data: projects } = await supabase
        .from('projects')
        .select('*, categories(name_fr, name_en, name_es)')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(3);

    const titleKey = `title_${locale}` as const;
    const categoryNameKey = `name_${locale}` as const;

    const featuredProjects = projects?.map((p: any) => ({
        id: p.id,
        title: p[titleKey] || p.title_fr,
        category: p.categories?.[categoryNameKey] || p.categories?.name_fr || '',
        image: p.cover_image_url || '',
        slug: p.slug,
        year: p.year,
    })) || [];

    return (
        <main className="flex min-h-screen flex-col">
            <Hero />
            <AboutPreview />
            <FeaturedProjects projects={featuredProjects} />
            <InstagramFeedAuto postsToShow={6} />
            <CallToAction />
        </main>
    );
}

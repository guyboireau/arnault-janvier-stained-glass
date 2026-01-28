
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CallToAction from '@/components/home/CallToAction';

export default async function HomePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <main>
            <Hero />
            <AboutPreview />
            <FeaturedProjects locale={locale} />
            <CallToAction />
        </main>
    );
}

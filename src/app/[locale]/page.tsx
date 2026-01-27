import { useTranslations } from 'next-intl';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import CallToAction from '@/components/home/CallToAction';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col">
            <Hero />
            <AboutPreview />
            <FeaturedProjects />
            <CallToAction />
        </main>
    );
}

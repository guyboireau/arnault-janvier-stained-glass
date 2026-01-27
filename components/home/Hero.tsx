import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
    const t = useTranslations('home.hero');

    return (
        <div className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{
                    backgroundImage: "url('/images/hero-bg.jpg')",
                    // Fallback if image missing or loading
                    backgroundColor: "#1a1a1a"
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 container px-4 mx-auto animate-fade-in-up">
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide drop-shadow-lg">
                    {t('title')}
                </h1>
                <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 text-neutral-200">
                    {t('subtitle')}
                </p>
                <Link
                    href="/gallery"
                    className="inline-block px-8 py-4 border-2 border-white text-white font-medium uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                >
                    {t('cta')}
                </Link>
            </div>
        </div>
    );
}

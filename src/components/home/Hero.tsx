'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Hero() {
    const t = useTranslations('home.hero');

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Image plein écran */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1579783902614-a3fb3927d6a5?q=80&w=2576&auto=format&fit=crop')`,
                }}
            />

            {/* Overlay sobre */}
            <div className="absolute inset-0 bg-neutral-950/45" />

            {/* Contenu minimal centré */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
                <p className="mb-4 text-xs tracking-[0.3em] uppercase text-white/60">
                    {t('badge')}
                </p>

                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                    {t('title')}
                </h1>

                <div className="mt-8 h-px w-16 bg-white/30" />

                <p className="mt-8 max-w-md text-base md:text-lg text-white/70 font-light leading-relaxed">
                    {t('subtitle')}
                </p>

                <Link
                    href="/gallery"
                    className="mt-10 inline-block border border-white/40 px-8 py-3 text-sm tracking-widest uppercase text-white/90 hover:bg-white/10 hover:border-white/70 transition-colors duration-300"
                >
                    {t('cta')}
                </Link>
            </div>
        </section>
    );
}

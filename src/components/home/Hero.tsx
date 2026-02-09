'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    const t = useTranslations('home.hero');

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background with layered overlays */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center animate-fade-in"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1579783902614-a3fb3927d6a5?q=80&w=2576&auto=format&fit=crop')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/40 to-neutral-950/90" />
                <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 via-transparent to-neutral-950/30" />
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent hidden lg:block" />
                <div className="absolute right-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent hidden lg:block" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
                {/* Badge */}
                <div className="animate-fade-in-up mb-8 opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 border border-gold-500/30 rounded-full text-gold-300 text-sm tracking-[0.2em] uppercase">
                        <span className="w-2 h-2 bg-gold-500 rounded-full" />
                        {t('badge') || 'Maître Verrier'}
                    </span>
                </div>

                {/* Title */}
                <h1
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-6 animate-fade-in-up opacity-0"
                    style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
                >
                    {t('title')}
                </h1>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500/60" />
                    <div className="w-2 h-2 rotate-45 border border-gold-500/60" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500/60" />
                </div>

                {/* Subtitle */}
                <p
                    className="text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up opacity-0"
                    style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
                >
                    {t('subtitle')}
                </p>

                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0"
                    style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
                >
                    <Link href="/gallery">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-6 text-base font-medium bg-gold-500 hover:bg-gold-600 text-neutral-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all duration-300 hover:scale-105"
                        >
                            {t('cta')}
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-10 py-6 text-base font-medium border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                        >
                            {t('ctaSecondary') || 'Me contacter'}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in opacity-0" style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}>
                <button
                    onClick={() => {
                        const el = document.getElementById('about-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex flex-col items-center gap-2 text-white/50 hover:text-gold-400 transition-colors group"
                    aria-label="Scroll down"
                >
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <ArrowDown className="h-4 w-4 animate-bounce" />
                </button>
            </div>
        </section>
    );
}

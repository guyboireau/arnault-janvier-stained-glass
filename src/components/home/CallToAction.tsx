'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
    const t = useTranslations('home.cta');

    return (
        <section className="py-28 lg:py-36 bg-neutral-950 relative overflow-hidden">
            {/* Stained glass inspired abstract background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gold-500 opacity-[0.04] blur-[150px]" />
                <div className="absolute bottom-[-30%] right-[-15%] w-[50%] h-[50%] rounded-full bg-gold-600 opacity-[0.03] blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-gold-400 opacity-[0.02] blur-[80px]" />
            </div>

            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
                {/* Decorative element */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/40" />
                    <div className="w-3 h-3 rotate-45 border border-gold-500/40" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/40" />
                </div>

                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {t('title')}
                </h2>
                <p className="text-neutral-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
                    {t('description')}
                </p>
                <Link href="/contact">
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-5 text-base font-semibold bg-gold-500 hover:bg-gold-600 text-neutral-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all duration-300 hover:scale-105 group"
                    >
                        {t('button')}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>

                {/* Bottom decorative */}
                <div className="mt-16 flex items-center justify-center gap-3 text-neutral-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-gold-500/40 rounded-full" />
                    <span>Paris, France</span>
                    <span className="w-1.5 h-1.5 bg-gold-500/40 rounded-full" />
                </div>
            </div>
        </section>
    );
}

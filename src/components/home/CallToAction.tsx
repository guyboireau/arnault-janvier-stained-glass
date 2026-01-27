'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';

export default function CallToAction() {
    const t = useTranslations('home.cta');

    return (
        <section className="py-24 bg-neutral-900 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                    {t('title')}
                </h2>
                <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    {t('description')}
                </p>
                <Link href="/contact">
                    <Button size="lg" className="rounded-full px-8 py-4 text-base font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30">
                        {t('button')}
                    </Button>
                </Link>
            </div>
        </section>
    );
}

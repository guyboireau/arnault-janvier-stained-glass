import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default async function AboutPreview() {
    const t = await getTranslations('home.about');

    return (
        <section className="py-24 bg-white">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[4/5] md:aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                            <span className="sr-only">Portrait Arnault Janvier</span>
                            Portrait
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="font-display text-4xl md:text-5xl text-neutral-900">
                            {t('title')}
                        </h2>
                        <p className="text-lg text-neutral-600 leading-relaxed">
                            {t('description')}
                        </p>
                        <Link
                            href="/about"
                            className="inline-block text-primary-600 font-medium hover:text-primary-700 transition-colors uppercase tracking-wider text-sm border-b-2 border-primary-600 pb-1"
                        >
                            {t('cta')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

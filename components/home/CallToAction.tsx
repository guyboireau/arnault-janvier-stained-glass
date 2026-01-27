import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function CallToAction() {
    const t = await getTranslations('home.cta');

    return (
        <section className="py-24 bg-neutral-900 text-white text-center">
            <div className="container px-4 mx-auto max-w-3xl">
                <h2 className="font-display text-4xl md:text-5xl mb-6">
                    {t('title')}
                </h2>
                <p className="text-xl text-neutral-300 font-light mb-10">
                    {t('description')}
                </p>
                <Link
                    href="/contact"
                    className="inline-block px-8 py-4 bg-white text-neutral-900 font-medium uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                    {t('button')}
                </Link>
            </div>
        </section>
    );
}

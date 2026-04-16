import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { locales } from '@/i18n/config';
import { PRESS_ITEMS_SETTINGS_KEY, type PressItem } from '@/lib/constants';
import { ExternalLink, Newspaper } from 'lucide-react';

type Props = { params: { locale: string } };

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
    const t = await getTranslations({ locale, namespace: 'presse' });
    return { title: t('title'), description: t('subtitle') };
}

export default async function PressePage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('presse');

    const supabase = createClient();
    const { data: settingsRow } = await (supabase as any)
        .from('site_settings')
        .select('value')
        .eq('key', PRESS_ITEMS_SETTINGS_KEY)
        .maybeSingle();

    const items: PressItem[] = settingsRow?.value
        ? Array.isArray(settingsRow.value)
            ? settingsRow.value
            : []
        : [];

    return (
        <main className="min-h-screen py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">{t('eyebrow')}</p>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                        {t('title')}
                    </h1>
                    <div className="h-px w-16 bg-neutral-200 mx-auto" />
                    <p className="text-neutral-500 max-w-xl mx-auto leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-24 text-neutral-400 flex flex-col items-center gap-4">
                        <Newspaper className="h-10 w-10 opacity-30" />
                        <p>{t('empty')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {items.map((item) => (
                            <article key={item.id} className="py-10 flex gap-8 items-start">
                                {item.cover_image_url && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={item.cover_image_url}
                                        alt={item.title}
                                        className="w-32 h-24 object-cover rounded-lg shrink-0 bg-neutral-100"
                                    />
                                )}
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3 text-xs text-neutral-400 uppercase tracking-wider">
                                        <span className="font-semibold text-neutral-600">{item.publication}</span>
                                        <span>·</span>
                                        <time dateTime={item.date}>
                                            {new Date(item.date).toLocaleDateString(locale, {
                                                year: 'numeric',
                                                month: 'long',
                                            })}
                                        </time>
                                    </div>
                                    <h2 className="font-display text-xl font-semibold text-neutral-900 leading-snug">
                                        {item.title}
                                    </h2>
                                    {item.excerpt && (
                                        <p className="text-neutral-500 leading-relaxed text-sm">
                                            {item.excerpt}
                                        </p>
                                    )}
                                    {item.url && (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                        >
                                            {t('readArticle')}
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

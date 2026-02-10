import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter, Playfair_Display } from 'next/font/google';
import { cn } from '@/lib/utils';
import { locales, type Locale } from '@/i18n/config';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale, namespace: 'metadata' });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnault-janvier.fr';

    // Locale alternates for multilingual SEO
    const alternateLanguages: Record<string, string> = {};
    locales.forEach((loc) => {
        const path = loc === 'fr' ? '' : `/${loc}`;
        alternateLanguages[loc] = `${baseUrl}${path}`;
    });

    return {
        title: {
            default: t('title'),
            template: `%s | ${t('title')}`,
        },
        description: t('description'),
        keywords: [
            'vitrail',
            'stained glass',
            'vitrailliste',
            'maître verrier',
            'master glazier',
            'art glass',
            'Paris',
            'artisan',
            'création',
            'restauration',
        ],
        authors: [{ name: 'Arnault Janvier' }],
        creator: 'Arnault Janvier',
        publisher: 'Arnault Janvier',
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: baseUrl,
            languages: alternateLanguages,
        },
        openGraph: {
            type: 'website',
            locale: locale,
            url: baseUrl,
            siteName: t('title'),
            title: t('title'),
            description: t('description'),
            images: [
                {
                    url: `${baseUrl}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: t('title'),
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('title'),
            description: t('description'),
            images: [`${baseUrl}/og-image.jpg`],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 5,
        },
        themeColor: [
            { media: '(prefers-color-scheme: light)', color: '#ffffff' },
            { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
        ],
    };
}

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Ensure that the incoming `locale` is valid
    // (In dynamic route params, type check might be needed or handled by middleware/routing)

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <head>
                {/* Additional structured data for Organization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Person',
                            name: 'Arnault Janvier',
                            jobTitle: 'Maître Verrier',
                            description: 'Artisan vitrailliste à Paris, spécialisé dans la création et la restauration de vitraux d\'art.',
                            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://arnault-janvier.fr',
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Paris',
                                addressCountry: 'FR',
                            },
                            sameAs: [
                                'https://instagram.com/glassncraft',
                            ],
                        }),
                    }}
                />
            </head>
            <body className={cn(inter.variable, playfair.variable, "font-sans antialiased")}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ToastProvider } from '@/hooks/useToast';

type Props = {
    params: { locale: string };
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
    const t = await getTranslations({ locale, namespace: 'contact' });

    return {
        title: t('title'),
        description: t('subtitle'),
    };
}

export default async function ContactPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('contact');

    return (
        <main className="min-h-screen py-24 md:py-32 bg-neutral-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                        {t('title')}
                    </h1>
                    <div className="h-1 w-20 bg-primary-500 mx-auto" />
                    <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1">{t('info.location')}</h3>
                                        <p className="text-neutral-600">
                                            GLASSNCRAFT STUDIO<br />
                                            123 Rue des Artistes<br />
                                            75018 Paris, France
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1">{t('info.email')}</h3>
                                        <a href="mailto:contact@arnault-janvier.fr" className="text-neutral-600 hover:text-primary-600 transition-colors">
                                            contact@arnault-janvier.fr
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary-50 rounded-full text-primary-600">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1">{t('info.phone')}</h3>
                                        <p className="text-neutral-600">
                                            +33 6 XX XX XX XX
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-neutral-200 h-64 rounded-2xl w-full flex items-center justify-center text-neutral-500">
                            Google Maps Integration
                        </div>
                    </div>

                    {/* Contact Form Area */}
                    <div className="lg:col-span-2">
                        <ToastProvider>
                            <ContactForm />
                        </ToastProvider>
                    </div>
                </div>
            </div>
        </main>
    );
}

import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import Image from 'next/image';

type Props = {
    params: { locale: string };
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
    const t = await getTranslations({ locale, namespace: 'about' });

    return {
        title: t('title'),
        description: t('subtitle'),
    };
}

export default async function AboutPage({ params: { locale } }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('about');

    // We can also fetch dynamic "about" content from supabase site_settings if implemented
    // For now, we use static structure with i18n messages

    const skills = [
        "Création de vitraux sur mesure",
        "Restauration du patrimoine",
        "Peinture sur verre (Grisaille)",
        "Dalle de verre",
        "Fusing et Thermoformage",
        "Pose et sécurisation"
    ];

    return (
        <main className="min-h-screen py-24 md:py-32">
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

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
                    {/* Image */}
                    <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder until real image */}
                        <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                            Portrait Arnault Janvier
                        </div>
                        {/* 
                 <Image 
                    src="/images/arnault-portrait.jpg" 
                    alt="Arnault Janvier" 
                    fill 
                    className="object-cover" 
                 /> 
                 */}
                    </div>

                    {/* Text */}
                    <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                        <p>
                            Depuis plus de 20 ans, l'atelier Arnault Janvier perpétue la tradition du vitrail d'art au cœur de Paris.
                            Maître verrier de formation, j'ai acquis mon savoir-faire auprès des plus grands ateliers de France avant de fonder ma propre structure.
                        </p>
                        <p>
                            Mon approche allie le respect scrupuleux des techniques médiévales pour la restauration, et une liberté créative totale pour les œuvres contemporaines. Le vitrail n'est pas un art du passé, c'est une matière vivante qui sculpte la lumière de nos intérieurs modernes.
                        </p>
                        <p>
                            Que ce soit pour une église classée, un hôtel particulier ou un appartement contemporain, chaque projet est une nouvelle rencontre entre l'architecture, la lumière et le verre.
                        </p>

                        <div className="pt-8">
                            <h3 className="font-display text-2xl font-bold text-neutral-900 mb-6">{t('skills.title')}</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {skills.map((skill, index) => (
                                    <li key={index} className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                                        <span>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative aspect-[3/4] lg:aspect-[4/5]">
                    {/* Placeholder image until user provides one */}
                    <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden relative">
                        <Image
                            src="https://images.unsplash.com/photo-1579270559388-39cb3275757d?auto=format&fit=crop&q=80"
                            alt="Arnault Janvier - Atelier"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--accent-gold)]">
                        {t('title')}
                    </h1>

                    <div className="space-y-6 text-slate-300 leading-relaxed font-light text-lg">
                        <p>{t('p1')}</p>
                        <p>{t('p2')}</p>
                        <p>{t('p3')}</p>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                        <h3 className="font-serif text-2xl text-[color:var(--accent-gold)] mb-6">{t('skillsTitle')}</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm uppercase tracking-wide text-slate-400">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[color:var(--accent-gold)] rounded-full"></span>
                                {t('skills.lead')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[color:var(--accent-gold)] rounded-full"></span>
                                {t('skills.tiffany')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[color:var(--accent-gold)] rounded-full"></span>
                                {t('skills.restoration')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[color:var(--accent-gold)] rounded-full"></span>
                                {t('skills.painting')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[color:var(--accent-gold)] rounded-full"></span>
                                {t('skills.slabs')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[color:var(--accent-gold)] rounded-full"></span>
                                {t('skills.contemporary')}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowRight, Palette, Hammer, Sparkles, Clock } from 'lucide-react';

const skills = [
    { icon: Palette, label: 'Création sur mesure' },
    { icon: Hammer, label: 'Restauration' },
    { icon: Sparkles, label: 'Art contemporain' },
    { icon: Clock, label: 'Techniques traditionnelles' },
];

export default function AboutPreview() {
    const t = useTranslations('home.about');

    return (
        <section id="about-section" className="py-28 lg:py-36 bg-neutral-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold-50/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Image Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="relative aspect-[4/5] w-full max-w-lg mx-auto">
                            {/* Main image */}
                            <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl">
                                <div
                                    className="h-full w-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop')`,
                                    }}
                                />
                            </div>

                            {/* Decorative frame */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-gold-500/30 rounded-tl-2xl" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-gold-500/30 rounded-br-2xl" />

                            {/* Experience badge */}
                            <div className="absolute -bottom-4 -right-4 lg:-right-8 bg-neutral-900 text-white p-5 rounded-2xl shadow-xl">
                                <div className="text-center">
                                    <span className="block text-3xl font-display font-bold text-gold-400">20+</span>
                                    <span className="block text-xs text-neutral-400 tracking-wider uppercase mt-1">
                                        {"Ans d'expérience"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <div>
                            <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
                                À propos
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mt-3 leading-tight heading-line">
                                {t('title')}
                            </h2>
                        </div>

                        <div className="space-y-5 text-neutral-600 leading-relaxed text-lg">
                            <p>
                                {t('description') || "Depuis plus de 20 ans, je consacre ma vie à l'art du vitrail. Entre tradition séculaire et innovation contemporaine, chaque œuvre est une nouvelle exploration de la lumière."}
                            </p>
                            <p className="hidden md:block text-neutral-500 italic border-l-2 border-gold-400 pl-4">
                                &ldquo;Le vitrail n&apos;est pas une image, c&apos;est une lumière qui prend forme.&rdquo;
                            </p>
                        </div>

                        {/* Skills grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:border-gold-200 transition-all duration-300"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center">
                                        <skill.icon className="h-5 w-5 text-gold-600" />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700">{skill.label}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/about">
                            <Button
                                variant="outline"
                                className="group rounded-full px-8 py-3 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 mt-4"
                            >
                                {t('cta')}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

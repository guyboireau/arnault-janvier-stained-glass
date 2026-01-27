'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function AboutPreview() {
    const t = useTranslations('home.about');

    return (
        <section className="py-24 bg-neutral-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:ml-auto rounded-lg overflow-hidden shadow-2xl">
                        {/* Placeholder image */}
                        <div className="absolute inset-0 bg-neutral-300 animate-pulse">
                            {/* 
                  NOTE: When real images are available, use next/image here.
                  <Image 
                    src="/images/portrait.jpg" 
                    alt="Arnault Janvier" 
                    fill 
                    className="object-cover"
                  /> 
                */}
                            <div className="h-full w-full flex items-center justify-center text-neutral-500 bg-neutral-200">
                                Portrait Placeholder
                            </div>
                        </div>
                    </div>

                    {/* Text Side */}
                    <div className="space-y-8 text-center md:text-left">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900">
                            {t('title')}
                        </h2>
                        <div className="h-1 w-20 bg-primary-500 mx-auto md:mx-0" />

                        <div className="space-y-6 text-neutral-600 leading-relaxed text-lg">
                            <p>
                                {t('description') || "Depuis plus de 20 ans, je consacre ma vie à l'art du vitrail. Entre tradition séculaire et innovation contemporaine, chaque œuvre est une nouvelle exploration de la lumière."}
                            </p>
                            <p className="hidden md:block">
                                "Le vitrail n'est pas une image, c'est une lumière qui prend forme."
                            </p>
                        </div>

                        <Link href="/about">
                            <Button variant="outline" className="group rounded-full px-6 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all">
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

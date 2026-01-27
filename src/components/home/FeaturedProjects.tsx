'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function FeaturedProjects() {
    const t = useTranslations('home.featured');

    // Temporary mock data until we hook up Supabase
    const projects = [
        {
            id: '1',
            title: 'Cathédrale Saint-Jean',
            category: 'Restauration',
            image: 'https://images.unsplash.com/photo-1596825205486-3cb3448a3182?q=80&w=2670&auto=format&fit=crop', // Placeholder
            slug: 'cathedrale-saint-jean'
        },
        {
            id: '2',
            title: 'Villa Moderne',
            category: 'Création Contemporaine',
            image: 'https://images.unsplash.com/photo-1698652309736-4074c76a5eb2?q=80&w=2576&auto=format&fit=crop', // Placeholder
            slug: 'villa-moderne'
        },
        {
            id: '3',
            title: 'Chapelle Privée',
            category: 'Art Sacré',
            image: 'https://images.unsplash.com/photo-1629837965939-f41724e54854?q=80&w=2670&auto=format&fit=crop', // Placeholder
            slug: 'chapelle-privee'
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <h2 className="font-display text-4xl font-bold text-neutral-900">{t('title')}</h2>
                        <div className="h-1 w-20 bg-primary-500" />
                        <p className="text-neutral-600 max-w-lg">
                            {t('subtitle')}
                        </p>
                    </div>

                    <Link href="/gallery">
                        <Button variant="ghost" className="group text-neutral-900">
                            {t('viewAll')}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <Link href={`/gallery/${project.slug}`} key={project.id} className="group">
                            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden rounded-none">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    {/* 
                      Placeholder for image. 
                      Use next/image when real images available.
                   */}
                                    <div
                                        className="absolute inset-0 bg-neutral-200 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${project.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight className="h-5 w-5 text-white" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                        <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-medium tracking-wider uppercase mb-3 rounded-sm">
                                            {project.category}
                                        </span>
                                        <h3 className="text-2xl font-display font-medium text-white mb-1 group-hover:text-primary-300 transition-colors">
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

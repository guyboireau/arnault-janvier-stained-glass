'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface FeaturedProject {
    id: string;
    title: string;
    category: string;
    image: string;
    slug: string;
    year?: number;
}

interface FeaturedProjectsProps {
    projects?: FeaturedProject[];
}

const mockProjects: FeaturedProject[] = [
    {
        id: '1',
        title: 'Cathédrale Saint-Jean',
        category: 'Restauration',
        image: 'https://images.unsplash.com/photo-1596825205486-3cb3448a3182?q=80&w=2670&auto=format&fit=crop',
        slug: 'cathedrale-saint-jean',
        year: 2023,
    },
    {
        id: '2',
        title: 'Villa Moderne',
        category: 'Création Contemporaine',
        image: 'https://images.unsplash.com/photo-1698652309736-4074c76a5eb2?q=80&w=2576&auto=format&fit=crop',
        slug: 'villa-moderne',
        year: 2024,
    },
    {
        id: '3',
        title: 'Chapelle Privée',
        category: 'Art Sacré',
        image: 'https://images.unsplash.com/photo-1629837965939-f41724e54854?q=80&w=2670&auto=format&fit=crop',
        slug: 'chapelle-privee',
        year: 2024,
    },
];

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
    const t = useTranslations('home.featured');
    const displayProjects = projects && projects.length > 0 ? projects : mockProjects;

    return (
        <section className="py-28 lg:py-36 bg-white relative">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="container mx-auto px-4 md:px-6 relative">
                {/* Section header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="text-gold-600 text-sm font-medium tracking-[0.2em] uppercase">
                            Portfolio
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mt-3 heading-line">
                            {t('title')}
                        </h2>
                        <p className="text-neutral-500 text-lg mt-6 leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </div>

                    <Link href="/gallery" className="shrink-0">
                        <Button variant="ghost" className="group text-neutral-900 hover:text-gold-700">
                            {t('viewAll')}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Projects grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {displayProjects.map((project, index) => (
                        <Link
                            href={`/gallery/${project.slug}`}
                            key={project.id}
                            className={`group relative block ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-neutral-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                                <div className={`relative overflow-hidden ${index === 0 ? 'aspect-[3/4] md:aspect-[16/9] lg:aspect-[3/4]' : 'aspect-[3/4]'}`}>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                        style={{ backgroundImage: `url(${project.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                                    <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <ArrowUpRight className="h-5 w-5 text-white" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="inline-block px-3 py-1 bg-gold-500/90 text-neutral-950 text-xs font-semibold tracking-wider uppercase rounded-full">
                                                {project.category}
                                            </span>
                                            {project.year && (
                                                <span className="text-white/60 text-sm">{project.year}</span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl lg:text-3xl font-display font-bold text-white leading-tight group-hover:text-gold-200 transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 to-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <Link href="/gallery">
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-10 py-4 border-neutral-300 text-neutral-700 hover:border-gold-500 hover:text-gold-700 hover:bg-gold-50 transition-all duration-300 group"
                        >
                            {t('viewAll')}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

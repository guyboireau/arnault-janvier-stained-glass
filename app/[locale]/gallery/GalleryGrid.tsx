'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Project = {
    id: string;
    title: string;
    slug: string;
    category_id: string;
    project_images: { url: string }[];
};

export default function GalleryGrid({
    projects,
    categories
}: {
    projects: Project[];
    categories: Category[];
}) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredProjects = selectedCategory === 'all'
        ? projects
        : projects.filter(p => p.category_id === selectedCategory);

    return (
        <div className="space-y-8">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all ${selectedCategory === 'all'
                            ? 'bg-[color:var(--accent-gold)] text-slate-950 font-bold'
                            : 'border border-white/20 hover:border-[color:var(--accent-gold)] text-slate-300'
                        }`}
                >
                    Tous
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all ${selectedCategory === cat.id
                                ? 'bg-[color:var(--accent-gold)] text-slate-950 font-bold'
                                : 'border border-white/20 hover:border-[color:var(--accent-gold)] text-slate-300'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                    <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group relative aspect-square overflow-hidden bg-slate-900 block"
                    >
                        {project.project_images?.[0]?.url ? (
                            <Image
                                src={project.project_images[0].url}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                No Image
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                            <div>
                                <h3 className="text-xl font-serif text-[color:var(--accent-gold)] mb-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {project.title}
                                </h3>
                                <span className="text-sm uppercase tracking-widest text-white/80 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 block">
                                    Voir le projet
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

'use client';

import { Link } from '@/i18n/routing';
import { Database } from '@/types/database';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProjectCardProps {
    project: Project & { category?: Category | null };
    locale: string;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
    // Determine localized title/category fallback
    const title = (project as any)[`title_${locale}`] || project.title_fr;
    const categoryName = project.category ? ((project.category as any)[`name_${locale}`] || project.category.name_fr) : '';

    return (
        <Link href={`/gallery/${project.slug}`} className="group block h-full">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
                {project.cover_image_url ? (
                    <Image
                        src={project.cover_image_url}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-400">
                        Scanning...
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform translate-y-2 group-hover:translate-y-0">
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                        <ArrowUpRight className="h-5 w-5 text-white" />
                    </div>

                    {categoryName && (
                        <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium tracking-wider uppercase mb-2 rounded-sm w-fit">
                            {categoryName}
                        </span>
                    )}

                    <h3 className="text-xl font-display font-medium text-white group-hover:text-primary-300 transition-colors">
                        {title}
                    </h3>

                    {project.location && (
                        <p className="text-neutral-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            {project.location} {project.year ? `— ${project.year}` : ''}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

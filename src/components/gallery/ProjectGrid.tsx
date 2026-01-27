'use client';

import { useState } from 'react';
import { Database } from '@/types/database';
import ProjectCard from './ProjectCard';
import CategoryFilter from './CategoryFilter';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProjectGridProps {
    projects: (Project & { category?: Category | null })[];
    categories: Category[];
    locale: string;
}

export default function ProjectGrid({ projects, categories, locale }: ProjectGridProps) {
    const t = useTranslations('gallery');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredProjects = activeCategory
        ? projects.filter((p) => p.category?.slug === activeCategory)
        : projects;

    return (
        <div>
            <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                locale={locale}
                labels={{ all: t('filters.all') }}
            />

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProjectCard project={project} locale={locale} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-24 text-neutral-500">
                    <p>{t('empty')}</p>
                </div>
            )}
        </div>
    );
}

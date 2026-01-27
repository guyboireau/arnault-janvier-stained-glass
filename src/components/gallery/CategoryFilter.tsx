'use client';

import { Database } from '@/types/database';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryFilterProps {
    categories: Category[];
    activeCategory: string | null;
    onSelectCategory: (slug: string | null) => void;
    locale: string;
    labels: {
        all: string;
    }
}

export default function CategoryFilter({ categories, activeCategory, onSelectCategory, locale, labels }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
                onClick={() => onSelectCategory(null)}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                    activeCategory === null
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                )}
            >
                {labels.all}
            </button>

            {categories.map((category) => {
                const name = (category as any)[`name_${locale}`] || category.name_fr;
                const isActive = activeCategory === category.slug;

                return (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.slug)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                            isActive
                                ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                        )}
                    >
                        {name}
                    </button>
                );
            })}
        </div>
    );
}

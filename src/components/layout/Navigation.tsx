'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SubItem {
    href: string;
    label: string;
}

interface NavItem {
    href?: string;
    label: string;
    children?: SubItem[];
}

export default function Navigation() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const links: NavItem[] = [
        { href: '/', label: t('home') },
        {
            label: t('projects'),
            children: [
                { href: '/projets?category=particuliers', label: t('projectsParticuliers') },
                { href: '/projets?category=retail', label: t('projectsRetail') },
                { href: '/projets?category=decoration', label: t('projectsDecoration') },
            ],
        },
        {
            label: t('realisations'),
            children: [
                { href: '/realisations?category=vitraux-ornementaux', label: t('realisationsOrnementaux') },
                { href: '/realisations?category=vitreries', label: t('realisationsVitreries') },
                { href: '/realisations?category=vitraux-peints', label: t('realisationsPeints') },
            ],
        },
        { href: '/about', label: t('about') },
        { href: '/presse', label: t('presse') },
        { href: '/contact', label: t('contact') },
    ];

    return (
        <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
                if (link.children) {
                    const isActive =
                        (link.label === t('projects') && pathname.startsWith('/projets')) ||
                        (link.label === t('realisations') && pathname.startsWith('/realisations'));
                    return (
                        <div
                            key={link.label}
                            className="relative"
                            onMouseEnter={() => setOpenDropdown(link.label)}
                            onMouseLeave={() => setOpenDropdown(null)}
                        >
                            <button
                                className={cn(
                                    'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-600',
                                    isActive ? 'text-primary-600' : 'text-neutral-600'
                                )}
                            >
                                {link.label}
                                <ChevronDown
                                    className={cn(
                                        'h-3.5 w-3.5 transition-transform duration-200',
                                        openDropdown === link.label ? 'rotate-180' : ''
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {openDropdown === link.label && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 top-full mt-2 w-52 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 z-50"
                                    >
                                        {link.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href as any}
                                                className="block px-4 py-2.5 text-sm text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 transition-colors"
                                                onClick={() => setOpenDropdown(null)}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                }

                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href!}
                        className={cn(
                            'relative text-sm font-medium transition-colors hover:text-primary-600',
                            isActive ? 'text-primary-600' : 'text-neutral-600'
                        )}
                    >
                        {link.label}
                        {isActive && (
                            <motion.div
                                layoutId="underline"
                                className="absolute left-0 top-full block h-0.5 w-full bg-primary-600 mt-1"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

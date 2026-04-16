'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

interface SubItem {
    href: string;
    label: string;
}

interface NavItem {
    href?: string;
    label: string;
    children?: SubItem[];
}

export default function MobileMenu() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);

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

    const toggleSection = (label: string) => {
        setOpenSection(prev => (prev === label ? null : label));
    };

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-neutral-600 hover:text-neutral-900"
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-display text-xl font-bold text-primary-900">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-neutral-400 hover:text-neutral-600"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-1">
                                {links.map((link) => {
                                    if (link.children) {
                                        const isExpanded = openSection === link.label;
                                        return (
                                            <div key={link.label}>
                                                <button
                                                    onClick={() => toggleSection(link.label)}
                                                    className={cn(
                                                        'w-full flex items-center justify-between px-2 py-3 text-lg font-medium rounded-lg transition-colors',
                                                        isExpanded
                                                            ? 'text-primary-600 bg-primary-50'
                                                            : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                                                    )}
                                                >
                                                    {link.label}
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-4 w-4 transition-transform duration-200',
                                                            isExpanded ? 'rotate-180' : ''
                                                        )}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pl-4 pb-2 flex flex-col space-y-1">
                                                                {link.children.map((child) => (
                                                                    <Link
                                                                        key={child.href}
                                                                        href={child.href as any}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="px-2 py-2 text-base text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-md transition-colors"
                                                                    >
                                                                        {child.label}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href!}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                'px-2 py-3 text-lg font-medium rounded-lg transition-colors',
                                                pathname === link.href
                                                    ? 'text-primary-600 bg-primary-50'
                                                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="mt-8 pt-8 border-t border-neutral-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-neutral-500">Langue / Language</span>
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

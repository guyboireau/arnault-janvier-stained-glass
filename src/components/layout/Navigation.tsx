'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Navigation() {
    const t = useTranslations('navigation');
    const pathname = usePathname();

    const links = [
        { href: '/', label: t('home') },
        { href: '/about', label: t('about') },
        { href: '/gallery', label: t('gallery') },
        { href: '/contact', label: t('contact') },
    ];

    return (
        <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "relative text-sm font-medium transition-colors hover:text-primary-600",
                            isActive ? "text-primary-600" : "text-neutral-600"
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

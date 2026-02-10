'use client';

import { useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut, FolderOpen, Mail, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileAdminNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations('admin.sidebar');

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/admin/projects', label: t('projects'), icon: FolderOpen },
        { href: '/admin/categories', label: t('categories'), icon: ImageIcon },
        { href: '/admin/messages', label: t('messages'), icon: Mail },
        { href: '/admin/settings', label: t('settings'), icon: Settings },
    ];

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                aria-label="Open menu"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={closeMenu}
                            aria-hidden="true"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed left-0 top-0 h-full w-64 bg-neutral-900 text-white p-6 z-50 flex flex-col shadow-xl"
                        >
                            {/* Header with Close Button */}
                            <div className="flex items-start justify-between mb-10">
                                <div>
                                    <h2 className="font-display text-xl font-bold">Arnault Janvier</h2>
                                    <span className="text-xs text-neutral-500 uppercase tracking-widest">{t('adminPanel')}</span>
                                </div>
                                <button
                                    onClick={closeMenu}
                                    className="p-1 text-neutral-400 hover:text-white transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 space-y-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={cn(
                                                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                                                isActive
                                                    ? "bg-primary-600 text-white"
                                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMenu();
                                }}
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 mt-auto"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>{t('logout')}</span>
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

'use client';

import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Image as ImageIcon, Settings, LogOut, FolderOpen, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/routing';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
        { href: '/admin/categories', label: 'Categories', icon: ImageIcon },
        { href: '/admin/messages', label: 'Messages', icon: Mail },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-900 text-white p-6 hidden md:flex flex-col">
            <div className="mb-10">
                <h2 className="font-display text-xl font-bold">Arnault Janvier</h2>
                <span className="text-xs text-neutral-500 uppercase tracking-widest">Admin Panel</span>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
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

            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 mt-auto"
            >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
            </button>
        </aside>
    );
}

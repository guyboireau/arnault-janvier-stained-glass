
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    // We can double check auth here or rely on middleware, 
    // but getting user here is good for displaying user info.
    // Middleware should have already redirected if no session.

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="font-serif text-xl font-bold text-[color:var(--accent-gold)]">Admin Panel</h1>
                    <p className="text-xs text-slate-400 mt-1">Arnault Janvier</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/projects" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                        Projets
                    </Link>
                    <Link href="/admin/categories" className="block px-4 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                        Catégories
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action="/auth/signout" method="post">
                        <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                            Déconnexion
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

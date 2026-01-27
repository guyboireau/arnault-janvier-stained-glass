import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/routing';
import Sidebar from '@/components/admin/Sidebar';
import { ToastProvider } from '@/hooks/useToast';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-neutral-100">
            <Sidebar />
            <div className="md:ml-64 min-h-screen p-8">
                <ToastProvider>
                    {children}
                </ToastProvider>
            </div>
        </div>
    );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/routing';
import Sidebar from '@/components/admin/Sidebar';
import MobileAdminNav from '@/components/admin/MobileAdminNav';
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
            <MobileAdminNav />
            <div className="md:ml-64 min-h-screen p-8 pt-16 md:pt-8">
                <ToastProvider>
                    {children}
                </ToastProvider>
            </div>
        </div>
    );
}

import ProjectForm from '@/components/admin/ProjectForm';
import { createClient } from '@/lib/supabase/server';
import { ToastProvider } from '@/hooks/useToast';
import { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

export default async function NewProjectPage() {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*');
    const categories = data as Category[] | null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-neutral-900">Create New Project</h1>
            <ToastProvider>
                <ProjectForm categories={categories || []} />
            </ToastProvider>
        </div>
    );
}

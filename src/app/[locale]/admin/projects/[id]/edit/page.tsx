import ProjectForm from '@/components/admin/ProjectForm';
import { createClient } from '@/lib/supabase/server';
import { ToastProvider } from '@/hooks/useToast';
import { notFound } from 'next/navigation';
import { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export default async function EditProjectPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: projectData } = await supabase.from('projects').select('*').eq('id', params.id).single();
    const project = projectData as Project | null;
    const { data: categoriesData } = await supabase.from('categories').select('*');
    const categories = categoriesData as Category[] | null;

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-neutral-900">Edit Project</h1>
            <ToastProvider>
                <ProjectForm initialData={project} categories={categories || []} isEdit />
            </ToastProvider>
        </div>
    );
}

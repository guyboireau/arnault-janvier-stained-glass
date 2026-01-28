
import { createClient } from '@/lib/supabase/server';
import NewProjectForm from '@/components/admin/NewProjectForm';

export default async function NewProjectPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Nouveau Projet</h1>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                <NewProjectForm categories={categories || []} />
            </div>
        </div>
    );
}

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import CategoryManager from '@/components/admin/CategoryManager';

type Category = Database['public']['Tables']['categories']['Row'];

export default async function CategoriesPage() {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').order('display_order');
    const categories = (data as Category[]) || [];

    return <CategoryManager initialCategories={categories} />;
}

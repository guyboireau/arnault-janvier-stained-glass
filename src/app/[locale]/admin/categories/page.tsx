import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/Card';
import { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

export default async function CategoriesPage() {
    const supabase = createClient();
    const { data } = await supabase.from('categories').select('*').order('display_order');
    const categories = data as Category[] | null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-neutral-900">Categories</h1>

            <div className="grid gap-4">
                {categories?.map((cat) => (
                    <Card key={cat.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="font-mono text-xs text-neutral-400">#{cat.display_order}</span>
                                <div>
                                    <h3 className="font-bold text-neutral-900">{cat.name_fr}</h3>
                                    <p className="text-sm text-neutral-500">{cat.slug}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <span className={`px-2 py-1 rounded text-xs ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {cat.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(!categories || categories.length === 0) && (
                    <p className="text-neutral-500">No categories found.</p>
                )}
            </div>
        </div>
    );
}

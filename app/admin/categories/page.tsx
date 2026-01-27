
import { createClient } from '@/lib/supabase/server';
import { createCategory, deleteCategory } from '@/lib/actions';

export default async function CategoriesPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Gestion des Catégories</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
                <h2 className="text-lg font-bold mb-4">Ajouter une catégorie</h2>
                <form action={createCategory} className="flex gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom de la catégorie"
                        className="flex-1 border border-slate-300 rounded px-4 py-2"
                        required
                    />
                    <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded hover:bg-slate-800 transition-colors">
                        Ajouter
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-lefts">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {categories?.map((category) => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">{category.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <form action={deleteCategory.bind(null, category.id)}>
                                        <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                                            Supprimer
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {categories?.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                                    Aucune catégorie pour le moment.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

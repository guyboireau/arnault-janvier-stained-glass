
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProject } from '@/lib/actions';

export default async function ProjectsAdminPage() {
    const supabase = createClient();
    const { data: projects } = await supabase
        .from('projects')
        .select('*, categories(name), project_images(url)')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Gestion des Projets</h1>
                <Link href="/admin/projects/new" className="bg-[color:var(--accent-gold)] text-slate-900 font-bold px-6 py-2 rounded hover:bg-[color:var(--accent-gold-hover)] transition-colors">
                    + Nouveau Projet
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Titre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Catégorie</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {projects?.map((project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative w-16 h-16 bg-slate-100 rounded overflow-hidden">
                                        {project.project_images?.[0]?.url && (
                                            <Image src={project.project_images[0].url} alt={project.title} fill className="object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">{project.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500">{project.categories?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <form action={deleteProject.bind(null, project.id)}>
                                        <button className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {projects?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Aucun projet. Commencez par en ajouter un.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

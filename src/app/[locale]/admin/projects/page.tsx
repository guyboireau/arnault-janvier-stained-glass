import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];

export default async function AdminProjectsPage() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
    const projects = data as Project[] | null;

    async function deleteProject(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        const supabase = createClient();
        await supabase.from('projects').delete().eq('id', id);
        revalidatePath('/admin/projects');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-display text-neutral-900">Projects</h1>
                <Link href="/admin/projects/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {projects?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-neutral-200 text-neutral-500">
                        No projects found. Create your first one!
                    </div>
                )}

                {projects?.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="relative h-16 w-16 bg-neutral-100 rounded-md overflow-hidden shrink-0">
                                {project.cover_image_url ? (
                                    <Image
                                        src={project.cover_image_url}
                                        alt={project.title_fr}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-xs text-neutral-400">No Img</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-neutral-900 truncate">{project.title_fr}</h3>
                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                    <span className={`inline-block w-2 h-2 rounded-full ${project.is_published ? 'bg-green-500' : 'bg-neutral-300'}`} />
                                    {project.is_published ? 'Published' : 'Draft'}
                                    {project.slug && <span className="text-xs font-mono bg-neutral-100 px-1 rounded">{project.slug}</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={`/gallery/${project.slug}`} target="_blank">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href={`/admin/projects/${project.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <form action={deleteProject}>
                                    <input type="hidden" name="id" value={project.id} />
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

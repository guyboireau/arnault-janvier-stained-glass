import ProjectForm from '@/components/admin/ProjectForm';
import { createClient } from '@/lib/supabase/server';
import { ToastProvider } from '@/hooks/useToast';
import { notFound } from 'next/navigation';
import { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type ProjectImage = Database['public']['Tables']['project_images']['Row'];

export default async function EditProjectPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: projectData } = await supabase.from('projects').select('*').eq('id', params.id).single();
    const project = projectData as Project | null;
    const { data: categoriesData } = await supabase.from('categories').select('*');
    const categories = categoriesData as Category[] | null;
    
    // Charger les images du projet depuis project_images
    const { data: imagesData, error: imagesError } = await (supabase as any)
        .from('project_images')
        .select('*')
        .eq('project_id', params.id)
        .order('display_order', { ascending: true });

    if (imagesError) {
        console.error('Error loading project images:', imagesError);
    }
    const images = imagesData as ProjectImage[] | null;

    if (!project) {
        notFound();
    }

    // Format images from project_images table
    let formattedImages = images?.map(img => ({
        id: img.id,
        url: img.image_url,
        name: img.alt_text || 'Image',
        size: 0,
        preview: img.image_url
    })) || [];

    // Fallback: if no images in project_images table, try the images JSONB field
    if (formattedImages.length === 0 && project.images) {
        try {
            const jsonImages = typeof project.images === 'string'
                ? JSON.parse(project.images)
                : project.images;
            if (Array.isArray(jsonImages) && jsonImages.length > 0) {
                formattedImages = jsonImages.map((img: any, index: number) => ({
                    id: `db-${index}-${Date.now()}`,
                    url: img.url,
                    name: img.alt_fr || img.alt || 'Image',
                    size: 0,
                    preview: img.url
                }));
            }
        } catch {
            // images field is not valid JSON, ignore
        }
    }

    // Final fallback: if still no images but cover_image_url exists, show that
    if (formattedImages.length === 0 && project.cover_image_url) {
        formattedImages = [{
            id: `cover-${Date.now()}`,
            url: project.cover_image_url,
            name: 'Image de couverture',
            size: 0,
            preview: project.cover_image_url
        }];
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-display text-neutral-900">Edit Project</h1>
            <ToastProvider>
                <ProjectForm 
                    initialData={project} 
                    categories={categories || []} 
                    isEdit 
                    initialImages={formattedImages}
                />
            </ToastProvider>
        </div>
    );
}

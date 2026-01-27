'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const { error } = await supabase
        .from('categories')
        .insert({ name, slug });

    if (error) {
        console.error('Error creating category:', error);
        return { error: error.message };
    }

    revalidatePath('/admin/categories');
    return { success: true };
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
        console.error('Error deleting category:', error);
        return { error: error.message };
    }

    revalidatePath('/admin/categories');
    return { success: true };
}

export async function createProject(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category_id = formData.get('category_id') as string;
    // Basic slug generation, might need to be more robust
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 1. Insert Project
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({ title, description, category_id, slug })
        .select()
        .single();

    if (projectError) {
        console.error('Error creating project:', projectError);
        return { error: projectError.message };
    }

    // 2. Handle Image Uploads (Multi-part form not directly supported easily in Server Actions with files, 
    // usually better to upload from client and send URLs, OR use a specific buffer handling. 
    // For simplicity, we'll assume the client uploads images to Storage first and sends URLs, 
    // OR we implement text-based fields. 
    // BUT since we want to be fancy, let's try to handle files if possible or do Client-Side upload.)

    // DECISION: To ensure reliability, we will implement Client-Side upload to Supabase Storage in the form component,
    // and then pass the returned URLs to this action or a separate action.
    // However, `formData` here contains the file objects if the form is multipart. 
    // Supabase Storage upload from Server Action is possible.

    const images = formData.getAll('images') as File[];

    if (images && images.length > 0) {
        for (const [index, image] of images.entries()) {
            if (image.size === 0) continue;

            const fileName = `${project.slug}/${Date.now()}-${image.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(fileName, image);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                continue;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(fileName);

            // Insert into project_images
            await supabase.from('project_images').insert({
                project_id: project.id,
                url: publicUrl,
                display_order: index
            });
        }
    }

    revalidatePath('/admin/projects');
    revalidatePath('/gallery');
    redirect('/admin/projects');
}

export async function deleteProject(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
        console.error('Error deleting project:', error);
        return { error: error.message };
    }

    revalidatePath('/admin/projects');
    return { success: true };
}

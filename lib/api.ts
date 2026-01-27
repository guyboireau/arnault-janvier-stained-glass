
import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getProjects = cache(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*, categories(*), project_images(*)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data;
});

export const getCategories = cache(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data;
});

export const getProjectBySlug = cache(async (slug: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select('*, categories(*), project_images(*)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching project ${slug}:`, error);
        return null;
    }

    return data;
});

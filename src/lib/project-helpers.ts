import { createClient } from '@/lib/supabase/server';

/**
 * Récupère toutes les images d'un projet depuis la table project_images
 * @param projectId - ID du projet
 * @returns Array d'objets image triés par display_order
 */
export async function getProjectImages(projectId: string) {
    const supabase = await createClient();
    
    const { data, error } = await (supabase as any)
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Erreur lors du chargement des images:', error);
        return [];
    }

    return (data || []) as Array<{ image_url: string; display_order: number; alt_text: string }>;
}

/**
 * Récupère l'image de couverture d'un projet (la première image)
 * @param projectId - ID du projet
 * @returns URL de l'image de couverture ou null
 */
export async function getProjectCoverImage(projectId: string) {
    const images = await getProjectImages(projectId);
    return images.length > 0 ? images[0].image_url : null;
}

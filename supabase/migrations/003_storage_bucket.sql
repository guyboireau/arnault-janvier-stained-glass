-- Configuration du bucket Supabase Storage pour les images de projets
-- Exécutez ce script dans le SQL Editor de Supabase

-- 1. Créer le bucket 'project-images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-images',
    'project-images',
    true, -- Bucket public pour accès direct aux images
    10485760, -- 10MB max par fichier
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurer les politiques RLS pour le bucket

-- Politique pour lecture publique (tout le monde peut voir les images)
CREATE POLICY "Les images sont accessibles publiquement"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Politique pour upload (utilisateurs authentifiés seulement)
CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

-- Politique pour mise à jour (utilisateurs authentifiés seulement)
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier des images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
)
WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

-- Politique pour suppression (utilisateurs authentifiés seulement)
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer des images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

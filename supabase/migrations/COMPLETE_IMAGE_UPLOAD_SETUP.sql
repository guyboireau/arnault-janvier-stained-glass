-- ============================================
-- Migration Complète: Upload d'Images
-- ============================================
-- Ce script vérifie et crée toutes les structures nécessaires
-- pour le système d'upload d'images

-- ÉTAPE 1: Vérifier que la table projects existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        RAISE EXCEPTION '⚠️  La table projects n''existe pas. Veuillez d''abord exécuter 001_initial_schema.sql depuis le SQL Editor de Supabase.';
    ELSE
        RAISE NOTICE '✅ Table projects trouvée';
    END IF;
END $$;

-- ÉTAPE 2: Créer la table project_images
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_images') THEN
        CREATE TABLE public.project_images (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            alt_text TEXT,
            display_order INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
        RAISE NOTICE '✅ Table project_images créée';
    ELSE
        RAISE NOTICE '✅ Table project_images existe déjà';
    END IF;
END $$;

-- ÉTAPE 3: Créer les index
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON public.project_images(display_order);

-- ÉTAPE 4: Créer la fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_project_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ÉTAPE 5: Créer le trigger
DROP TRIGGER IF EXISTS update_project_images_updated_at_trigger ON public.project_images;
CREATE TRIGGER update_project_images_updated_at_trigger
    BEFORE UPDATE ON public.project_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_images_updated_at();

-- ÉTAPE 6: Activer RLS
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 7: Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Les images des projets sont visibles publiquement" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent insérer des images" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier des images" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent supprimer des images" ON public.project_images;

-- ÉTAPE 8: Créer les politiques RLS
CREATE POLICY "Les images des projets sont visibles publiquement"
    ON public.project_images FOR SELECT
    USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent insérer des images"
    ON public.project_images FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier des images"
    ON public.project_images FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer des images"
    ON public.project_images FOR DELETE
    USING (auth.role() = 'authenticated');

-- ÉTAPE 9: Ajouter les commentaires
COMMENT ON TABLE public.project_images IS 'Stocke les images associées aux projets de vitrail';
COMMENT ON COLUMN public.project_images.project_id IS 'Référence au projet parent';
COMMENT ON COLUMN public.project_images.image_url IS 'URL publique de l''image stockée dans Supabase Storage';
COMMENT ON COLUMN public.project_images.alt_text IS 'Texte alternatif pour l''accessibilité';
COMMENT ON COLUMN public.project_images.display_order IS 'Ordre d''affichage des images dans la galerie';

-- ÉTAPE 10: Vérifier/Créer le bucket Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'project-images',
    'project-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- ÉTAPE 11: Supprimer les anciennes politiques Storage
DROP POLICY IF EXISTS "Les images sont accessibles publiquement" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent uploader des images" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier des images" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent supprimer des images" ON storage.objects;

-- ÉTAPE 12: Créer les politiques Storage
CREATE POLICY "Les images sont accessibles publiquement"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

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

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer des images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

-- ============================================
-- 🎉 Migration terminée avec succès !
-- ============================================
-- Vous pouvez maintenant uploader des images dans l'interface admin

-- Création de la table project_images pour gérer plusieurs images par projet
-- IMPORTANT: Vous devez d'abord exécuter 001_initial_schema.sql avant cette migration

-- Vérifier que la table projects existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects') THEN
        RAISE EXCEPTION 'La table projects n''existe pas. Veuillez d''abord exécuter 001_initial_schema.sql';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON public.project_images(display_order);

-- Trigger pour mettre à jour automatically updated_at
CREATE OR REPLACE FUNCTION update_project_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_project_images_updated_at_trigger ON public.project_images;
CREATE TRIGGER update_project_images_updated_at_trigger
    BEFORE UPDATE ON public.project_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_project_images_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Les images des projets sont visibles publiquement" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent insérer des images" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier des images" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent supprimer des images" ON public.project_images;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Les images des projets sont visibles publiquement" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent insérer des images" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent modifier des images" ON public.project_images;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent supprimer des images" ON public.project_images;

-- Politique pour lecture publique (tout le monde peut voir les images)
CREATE POLICY "Les images des projets sont visibles publiquement"
    ON public.project_images FOR SELECT
    USING (true);

-- Politique pour les insertions (authentification requise)
CREATE POLICY "Les utilisateurs authentifiés peuvent insérer des images"
    ON public.project_images FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Politique pour les mises à jour (authentification requise)
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier des images"
    ON public.project_images FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Politique pour les suppressions (authentification requise)
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer des images"
    ON public.project_images FOR DELETE
    USING (auth.role() = 'authenticated');

-- Commentaires pour la documentation
COMMENT ON TABLE public.project_images IS 'Stocke les images associées aux projets de vitrail';
COMMENT ON COLUMN public.project_images.project_id IS 'Référence au projet parent';
COMMENT ON COLUMN public.project_images.image_url IS 'URL publique de l''image stockée dans Supabase Storage';
COMMENT ON COLUMN public.project_images.alt_text IS 'Texte alternatif pour l''accessibilité';
COMMENT ON COLUMN public.project_images.display_order IS 'Ordre d''affichage des images dans la galerie';

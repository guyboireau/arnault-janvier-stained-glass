-- ============================================
-- Migration 005 : Seed données Arnault Janvier
-- - Mise à jour site_info avec les vraies coordonnées
-- - Initialisation de press_items (vide)
-- - Bucket contact-attachments (pièces jointes formulaire)
-- ============================================


-- ============================================
-- 1. site_info — coordonnées réelles
-- ============================================
INSERT INTO public.site_settings (key, value)
VALUES (
    'site_info',
    '{
        "title_fr": "Arnault Janvier — Maître Verrier",
        "title_en": "Arnault Janvier — Master Glazier",
        "title_es": "Arnault Janvier — Maestro Vidriero",
        "description_fr": "Artisan vitrailliste à Paris. Création et restauration de vitraux d''art sur mesure.",
        "description_en": "Stained glass artisan in Paris. Bespoke creation and restoration of art glass.",
        "description_es": "Artesano vidriero en París. Creación y restauración de vidrieras artísticas a medida.",
        "email": "arnault.janvier1@gmail.com",
        "phone": "",
        "ateliers": [
            { "label": "Atelier MMAD", "address": "23 cours Anatole France", "city": "03000 Moulins" },
            { "label": "Atelier Paris", "address": "26 rue Pixérécourt",      "city": "75020 Paris"   }
        ],
        "siege": { "address": "45 rue des Saules", "city": "75018 Paris" },
        "instagram": "https://instagram.com/arnault.janvier",
        "instagram_handle": "@arnault.janvier",
        "youtube": "",
        "horaires": "Lundi – Vendredi, sur rendez-vous uniquement"
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE
    SET value      = EXCLUDED.value,
        updated_at = NOW();


-- ============================================
-- 2. press_items — tableau vide initial
-- ============================================
INSERT INTO public.site_settings (key, value)
VALUES ('press_items', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ============================================
-- 3. Bucket contact-attachments
--    Pièces jointes du formulaire de contact
--    (PNG, JPG, PDF — 5 Mo max par fichier)
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'contact-attachments',
    'contact-attachments',
    true,
    5242880, -- 5 Mo
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique (pour les URLs dans les emails)
CREATE POLICY IF NOT EXISTS "contact-attachments public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'contact-attachments');

-- Upload depuis le serveur Next.js (service role ou anon selon config)
CREATE POLICY IF NOT EXISTS "contact-attachments public insert"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'contact-attachments');

-- Suppression réservée aux admins
CREATE POLICY IF NOT EXISTS "contact-attachments admin delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'contact-attachments' AND auth.role() = 'authenticated');

-- ============================================
-- SCHEMA: Site Vitrine Arnault Janvier
-- ============================================

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_fr VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    name_es VARCHAR(200),
    description_fr TEXT,
    description_en TEXT,
    description_es TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: projects
-- ============================================
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    
    -- Titres multilingues
    title_fr VARCHAR(300) NOT NULL,
    title_en VARCHAR(300),
    title_es VARCHAR(300),
    
    -- Descriptions multilingues
    description_fr TEXT,
    description_en TEXT,
    description_es TEXT,
    
    -- Contenu détaillé multilingue
    content_fr TEXT,
    content_en TEXT,
    content_es TEXT,
    
    -- Métadonnées
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    year INTEGER,
    location VARCHAR(200),
    client_name VARCHAR(200),
    
    -- Images
    cover_image_url TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    -- Format: [{"url": "...", "alt_fr": "...", "alt_en": "...", "alt_es": "...", "order": 0}]
    
    -- Vidéos
    videos JSONB DEFAULT '[]'::jsonb,
    -- Format: [{"type": "instagram|youtube", "url": "...", "embed_id": "...", "title": "..."}]
    
    -- SEO
    seo_title_fr VARCHAR(70),
    seo_title_en VARCHAR(70),
    seo_title_es VARCHAR(70),
    seo_description_fr VARCHAR(160),
    seo_description_en VARCHAR(160),
    seo_description_es VARCHAR(160),
    
    -- Statut
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: site_settings
-- ============================================
CREATE TABLE public.site_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: contact_submissions
-- ============================================
CREATE TABLE public.contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(300),
    message TEXT NOT NULL,
    locale VARCHAR(5) DEFAULT 'fr',
    ip_address INET,
    user_agent TEXT,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_projects_category ON public.projects(category_id);
CREATE INDEX idx_projects_published ON public.projects(is_published, display_order);
CREATE INDEX idx_projects_featured ON public.projects(is_featured, is_published);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_active ON public.categories(is_active, display_order);

-- ============================================
-- TRIGGERS: Updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Politique: Lecture publique des projets publiés
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_published = true);

-- Politique: Lecture publique des catégories actives
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true);

-- Politique: Admin full access sur projects
CREATE POLICY "Admin full access projects"
    ON public.projects FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Politique: Admin full access sur categories
CREATE POLICY "Admin full access categories"
    ON public.categories FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Politique: Admin full access sur settings
CREATE POLICY "Admin full access settings"
    ON public.site_settings FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Politique: Insert public pour contact (avec rate limiting côté app)
CREATE POLICY "Public can submit contact"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

-- Politique: Admin peut lire les contacts
CREATE POLICY "Admin can view contacts"
    ON public.contact_submissions FOR SELECT
    USING (auth.role() = 'authenticated');

-- Politique: Admin peut modifier les contacts
CREATE POLICY "Admin can update contacts"
    ON public.contact_submissions FOR UPDATE
    USING (auth.role() = 'authenticated');

-- ============================================
-- Seed Data
-- ============================================
-- Catégories initiales
INSERT INTO public.categories (slug, name_fr, name_en, name_es, display_order) VALUES
('vitraux-religieux', 'Vitraux Religieux', 'Religious Stained Glass', 'Vidrieras Religiosas', 1),
('art-contemporain', 'Art Contemporain', 'Contemporary Art', 'Arte Contemporáneo', 2),
('restauration', 'Restauration', 'Restoration', 'Restauración', 3),
('decoration-interieure', 'Décoration Intérieure', 'Interior Design', 'Decoración Interior', 4),
('commandes-speciales', 'Commandes Spéciales', 'Custom Orders', 'Pedidos Especiales', 5);

-- Paramètres du site (initial dummy data)
INSERT INTO public.site_settings (key, value) VALUES
('site_info', '{
    "title_fr": "Arnault Janvier - Maître Verrier",
    "title_en": "Arnault Janvier - Master Glazier", 
    "title_es": "Arnault Janvier - Maestro Vidriero",
    "description_fr": "Artisan vitrailliste à Paris. Création, restauration et personnalisation de vitraux d''art.",
    "description_en": "Stained glass artisan in Paris. Creation, restoration and customization of art glass.",
    "description_es": "Artesano vidriero en París. Creación, restauración y personalización de vidrieras artísticas.",
    "email": "contact@arnault-janvier.fr",
    "phone": "+33 X XX XX XX XX",
    "address": "Paris, France",
    "instagram": "https://instagram.com/glassncraft",
    "youtube": ""
}'::jsonb);

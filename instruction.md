# 🤖 Agent IA - Guide de Développement Complet
## Site Vitrine Arnault Janvier - Vitrailliste

> **Ce document est optimisé pour être utilisé comme contexte par un agent IA de codage (Claude Code, Cursor, Copilot, etc.)**

---

## 📋 CONTEXTE PROJET

### Client
- **Nom** : Arnault Janvier
- **Entreprise** : GLASSNCRAFT STUDIOGNC
- **Métier** : Artisan vitrailliste (maître verrier)
- **Localisation** : Paris 18e, France
- **Présence sociale** : Instagram actif avec Reels, chaîne YouTube

### Objectif
Créer un site vitrine professionnel permettant de :
1. Présenter l'artisan et son savoir-faire
2. Exposer ses réalisations en galerie photo/vidéo
3. Permettre aux visiteurs de le contacter
4. Être autonome pour gérer son contenu (back-office)
5. Toucher une clientèle internationale (multilingue)

### Livrables Contractuels
- Site responsive (mobile-first)
- Page d'accueil
- Page À propos
- Galerie projets avec catégories
- Intégration vidéos (Instagram Reels, YouTube)
- Formulaire de contact
- Back-office admin simple
- Multilingue : Français, Anglais, Espagnol
- SEO de base
- Hébergement gratuit (Vercel + Supabase)

---

## 🛠️ STACK TECHNIQUE

```yaml
Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
Database: Supabase (PostgreSQL)
Storage: Supabase Storage
Auth: Supabase Auth
i18n: next-intl
Email: Resend (ou Supabase Edge Functions)
Deployment: Vercel
Analytics: Google Analytics 4 (optionnel)
```

### Dépendances Principales

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next-intl": "^3.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.300.0",
    "resend": "^2.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0"
  }
}
```

---

## 📁 STRUCTURE DU PROJET

```
arnault-janvier-vitrail/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-bg.jpg
│   │   └── placeholder.jpg
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Accueil
│   │   │   ├── about/
│   │   │   │   └── page.tsx                # À propos
│   │   │   ├── gallery/
│   │   │   │   ├── page.tsx                # Galerie
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx            # Projet détail
│   │   │   ├── contact/
│   │   │   │   └── page.tsx                # Contact
│   │   │   └── admin/
│   │   │       ├── layout.tsx              # Layout admin (auth check)
│   │   │       ├── page.tsx                # Dashboard
│   │   │       ├── projects/
│   │   │       │   ├── page.tsx            # Liste projets
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx        # Nouveau projet
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx    # Éditer projet
│   │   │       ├── categories/
│   │   │       │   └── page.tsx            # Gérer catégories
│   │   │       └── settings/
│   │   │           └── page.tsx            # Paramètres site
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts                # API envoi email
│   │   │   └── revalidate/
│   │   │       └── route.ts                # Revalidation cache
│   │   ├── globals.css
│   │   └── layout.tsx                      # Root layout
│   ├── components/
│   │   ├── ui/                             # Composants génériques
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── AboutPreview.tsx
│   │   │   ├── FeaturedProjects.tsx
│   │   │   └── CallToAction.tsx
│   │   ├── gallery/
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   └── VideoEmbed.tsx
│   │   ├── contact/
│   │   │   └── ContactForm.tsx
│   │   └── admin/
│   │       ├── Sidebar.tsx
│   │       ├── ProjectForm.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── CategoryManager.tsx
│   │       └── RichTextEditor.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                   # Client browser
│   │   │   ├── server.ts                   # Client server
│   │   │   ├── admin.ts                    # Client admin (service role)
│   │   │   └── middleware.ts               # Auth middleware
│   │   ├── utils.ts                        # Helpers généraux
│   │   ├── constants.ts                    # Constantes
│   │   └── validations.ts                  # Schémas Zod
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   ├── useCategories.ts
│   │   └── useToast.ts
│   ├── types/
│   │   ├── database.ts                     # Types Supabase générés
│   │   ├── project.ts
│   │   └── category.ts
│   └── i18n/
│       ├── config.ts
│       ├── request.ts
│       └── routing.ts
├── messages/
│   ├── fr.json
│   ├── en.json
│   └── es.json
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── .env.local.example
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── middleware.ts
└── README.md
```

---

## 🗄️ SCHÉMA BASE DE DONNÉES (Supabase)

### Migration SQL Initiale

```sql
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
-- STORAGE BUCKETS
-- ============================================
-- À créer manuellement dans Supabase Dashboard ou via API:
-- 1. Bucket "projects" (public)
-- 2. Bucket "site-assets" (public)
```

### Données de Seed (Exemple)

```sql
-- Catégories initiales
INSERT INTO public.categories (slug, name_fr, name_en, name_es, display_order) VALUES
('vitraux-religieux', 'Vitraux Religieux', 'Religious Stained Glass', 'Vidrieras Religiosas', 1),
('art-contemporain', 'Art Contemporain', 'Contemporary Art', 'Arte Contemporáneo', 2),
('restauration', 'Restauration', 'Restoration', 'Restauración', 3),
('decoration-interieure', 'Décoration Intérieure', 'Interior Design', 'Decoración Interior', 4),
('commandes-speciales', 'Commandes Spéciales', 'Custom Orders', 'Pedidos Especiales', 5);

-- Paramètres du site
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
}'::jsonb),
('about_content', '{
    "bio_fr": "",
    "bio_en": "",
    "bio_es": ""
}'::jsonb);
```

---

## 🌍 CONFIGURATION i18n (next-intl)

### src/i18n/config.ts

```typescript
export const locales = ['fr', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
};
```

### src/i18n/request.ts

```typescript
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    return { messages: {} };
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### src/i18n/routing.ts

```typescript
import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Cache le préfixe pour la locale par défaut
});

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
```

### middleware.ts

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes
    // - Static files
    // - _next internals
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
```

### messages/fr.json (Structure)

```json
{
  "metadata": {
    "title": "Arnault Janvier - Maître Verrier",
    "description": "Artisan vitrailliste à Paris. Création, restauration et personnalisation de vitraux d'art."
  },
  "navigation": {
    "home": "Accueil",
    "about": "À propos",
    "gallery": "Galerie",
    "contact": "Contact"
  },
  "home": {
    "hero": {
      "title": "L'Art du Vitrail",
      "subtitle": "Création et restauration de vitraux d'exception",
      "cta": "Découvrir mes créations"
    },
    "about": {
      "title": "Artisan Vitrailliste",
      "description": "Passionné par l'art du verre depuis plus de X années...",
      "cta": "En savoir plus"
    },
    "featured": {
      "title": "Réalisations",
      "subtitle": "Découvrez mes dernières créations",
      "viewAll": "Voir toute la galerie"
    },
    "cta": {
      "title": "Un projet en tête ?",
      "description": "Chaque vitrail est unique. Discutons de votre vision.",
      "button": "Me contacter"
    }
  },
  "about": {
    "title": "À propos",
    "subtitle": "Mon parcours et ma passion",
    "skills": {
      "title": "Savoir-faire",
      "items": ["Création sur mesure", "Restauration", "Techniques traditionnelles", "Art contemporain"]
    }
  },
  "gallery": {
    "title": "Galerie",
    "subtitle": "Mes réalisations",
    "filters": {
      "all": "Tous",
      "filterBy": "Filtrer par catégorie"
    },
    "project": {
      "viewDetails": "Voir le projet",
      "year": "Année",
      "location": "Lieu",
      "category": "Catégorie",
      "backToGallery": "Retour à la galerie"
    },
    "empty": "Aucun projet dans cette catégorie pour le moment."
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Parlons de votre projet",
    "form": {
      "name": "Nom",
      "namePlaceholder": "Votre nom",
      "email": "Email",
      "emailPlaceholder": "votre@email.com",
      "phone": "Téléphone (optionnel)",
      "phonePlaceholder": "+33 6 XX XX XX XX",
      "subject": "Sujet",
      "subjectPlaceholder": "L'objet de votre message",
      "message": "Message",
      "messagePlaceholder": "Décrivez votre projet ou posez votre question...",
      "submit": "Envoyer",
      "sending": "Envoi en cours...",
      "success": "Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.",
      "error": "Une erreur est survenue. Veuillez réessayer ou me contacter directement par email."
    },
    "info": {
      "title": "Informations",
      "email": "Email",
      "phone": "Téléphone",
      "location": "Localisation",
      "social": "Réseaux sociaux"
    }
  },
  "footer": {
    "rights": "Tous droits réservés",
    "madeBy": "Site réalisé par",
    "legal": "Mentions légales"
  },
  "common": {
    "loading": "Chargement...",
    "error": "Une erreur est survenue",
    "retry": "Réessayer",
    "close": "Fermer",
    "previous": "Précédent",
    "next": "Suivant"
  },
  "admin": {
    "dashboard": {
      "title": "Tableau de bord",
      "projects": "Projets",
      "categories": "Catégories",
      "messages": "Messages",
      "settings": "Paramètres"
    },
    "projects": {
      "title": "Gestion des projets",
      "new": "Nouveau projet",
      "edit": "Modifier",
      "delete": "Supprimer",
      "publish": "Publier",
      "unpublish": "Dépublier",
      "featured": "Mettre en avant"
    }
  }
}
```

---

## 🧩 COMPOSANTS CLÉS - SPÉCIFICATIONS

### 1. Header (src/components/layout/Header.tsx)

```typescript
/**
 * Header principal du site
 * 
 * COMPORTEMENT:
 * - Sticky au scroll avec effet de transparence vers fond solide
 * - Navigation desktop: liens horizontaux + sélecteur langue
 * - Navigation mobile: hamburger menu
 * - Logo cliquable vers accueil
 * 
 * PROPS: Aucune (utilise usePathname pour active state)
 * 
 * STYLE:
 * - Fond transparent au top, devient blanc/sombre au scroll
 * - Transition smooth sur le background
 * - Z-index élevé (50+)
 */
```

### 2. LanguageSwitcher (src/components/layout/LanguageSwitcher.tsx)

```typescript
/**
 * Sélecteur de langue
 * 
 * COMPORTEMENT:
 * - Dropdown avec les 3 langues (FR/EN/ES)
 * - Affiche le drapeau + code de la langue actuelle
 * - Change l'URL avec le nouveau locale
 * - Préserve le pathname actuel
 * 
 * UTILISE: next-intl useRouter, usePathname
 */
```

### 3. Hero (src/components/home/Hero.tsx)

```typescript
/**
 * Section hero de la page d'accueil
 * 
 * DESIGN:
 * - Plein écran (100vh) ou 80vh minimum
 * - Image de fond avec overlay gradient
 * - Titre principal centré
 * - Sous-titre
 * - CTA button vers /gallery
 * 
 * ANIMATIONS:
 * - Fade in au chargement
 * - Parallax léger sur l'image (optionnel)
 */
```

### 4. ProjectGrid (src/components/gallery/ProjectGrid.tsx)

```typescript
/**
 * Grille de projets responsive
 * 
 * PROPS:
 * - projects: Project[]
 * - locale: Locale
 * 
 * LAYOUT:
 * - Mobile: 1 colonne
 * - Tablet: 2 colonnes
 * - Desktop: 3 colonnes
 * - Gap: 24px
 * 
 * FEATURES:
 * - Lazy loading des images
 * - Animation au hover (scale + overlay)
 * - Skeleton pendant le chargement
 */
```

### 5. ProjectCard (src/components/gallery/ProjectCard.tsx)

```typescript
/**
 * Carte individuelle d'un projet
 * 
 * PROPS:
 * - project: Project
 * - locale: Locale
 * - priority?: boolean (pour LCP)
 * 
 * CONTENU:
 * - Image cover (aspect-ratio 4:3 ou 3:2)
 * - Titre
 * - Catégorie (badge)
 * - Année (optionnel)
 * 
 * HOVER:
 * - Scale léger (1.02-1.05)
 * - Overlay avec "Voir le projet"
 * - Transition 300ms ease
 */
```

### 6. CategoryFilter (src/components/gallery/CategoryFilter.tsx)

```typescript
/**
 * Filtres par catégorie
 * 
 * PROPS:
 * - categories: Category[]
 * - activeCategory: string | null
 * - onCategoryChange: (slug: string | null) => void
 * - locale: Locale
 * 
 * DESIGN:
 * - Pills/Chips horizontaux scrollables sur mobile
 * - "Tous" toujours en premier
 * - Active state visuellement distinct
 * 
 * COMPORTEMENT:
 * - Mise à jour URL avec searchParams (sans rechargement)
 * - Animation de transition sur le grid
 */
```

### 7. Lightbox (src/components/gallery/Lightbox.tsx)

```typescript
/**
 * Lightbox pour visualisation images plein écran
 * 
 * PROPS:
 * - images: {url: string, alt: string}[]
 * - initialIndex: number
 * - isOpen: boolean
 * - onClose: () => void
 * 
 * FEATURES:
 * - Navigation flèches gauche/droite
 * - Fermeture sur Escape ou clic overlay
 * - Swipe sur mobile
 * - Indicateur de position (1/5)
 * - Zoom (optionnel)
 * 
 * ACCESSIBILITÉ:
 * - Focus trap
 * - aria-label sur les boutons
 */
```

### 8. VideoEmbed (src/components/gallery/VideoEmbed.tsx)

```typescript
/**
 * Embed responsive pour vidéos
 * 
 * PROPS:
 * - type: 'instagram' | 'youtube'
 * - embedId: string
 * - title?: string
 * 
 * INSTAGRAM REELS:
 * - Embed via iframe: https://www.instagram.com/reel/{embedId}/embed
 * - Aspect ratio 9:16
 * 
 * YOUTUBE:
 * - Embed via iframe: https://www.youtube.com/embed/{embedId}
 * - Aspect ratio 16:9
 * 
 * LAZY LOADING:
 * - Afficher thumbnail + bouton play
 * - Charger iframe au clic
 */
```

### 9. ContactForm (src/components/contact/ContactForm.tsx)

```typescript
/**
 * Formulaire de contact
 * 
 * CHAMPS:
 * - name: string (required)
 * - email: email (required)
 * - phone: string (optional)
 * - subject: string (optional)
 * - message: text (required, min 10 chars)
 * 
 * VALIDATION: Zod + react-hook-form
 * 
 * SOUMISSION:
 * - POST /api/contact
 * - Affiche loading state
 * - Message succès/erreur
 * - Reset form on success
 * 
 * SPAM PROTECTION:
 * - Honeypot field
 * - Rate limiting côté API
 */
```

### 10. ImageUploader (src/components/admin/ImageUploader.tsx)

```typescript
/**
 * Upload d'images pour l'admin
 * 
 * PROPS:
 * - bucket: string
 * - path: string
 * - onUpload: (url: string) => void
 * - maxSize?: number (MB, default 5)
 * - accept?: string (default "image/*")
 * 
 * FEATURES:
 * - Drag & drop
 * - Preview avant upload
 * - Progress bar
 * - Compression côté client (optionnel)
 * - Génération URL publique Supabase
 * 
 * VALIDATION:
 * - Taille max
 * - Format accepté
 * - Dimensions (optionnel)
 */
```

---

## 🔌 API ROUTES

### POST /api/contact

```typescript
/**
 * Endpoint pour soumission formulaire contact
 * 
 * BODY:
 * {
 *   name: string,
 *   email: string,
 *   phone?: string,
 *   subject?: string,
 *   message: string,
 *   locale: string,
 *   honeypot?: string // Si rempli = spam
 * }
 * 
 * ACTIONS:
 * 1. Validation Zod
 * 2. Check honeypot (spam)
 * 3. Rate limiting par IP (5/heure)
 * 4. Insert en DB (contact_submissions)
 * 5. Envoi email notification via Resend
 * 6. Return success/error
 * 
 * RESPONSE:
 * { success: true } ou { error: string }
 */
```

### POST /api/revalidate

```typescript
/**
 * Revalidation du cache ISR
 * 
 * HEADERS:
 * - x-revalidate-token: string (secret)
 * 
 * BODY:
 * {
 *   paths: string[] // ex: ["/gallery", "/gallery/mon-projet"]
 * }
 * 
 * USAGE:
 * Appelé après modification en admin pour rafraîchir le cache
 */
```

---

## 🎨 DESIGN SYSTEM

### Couleurs (tailwind.config.ts)

```typescript
colors: {
  // Couleurs principales - à adapter selon branding
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Couleur principale
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  // Tons neutres élégants
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
}
```

### Typographie

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  display: ['var(--font-playfair)', 'Georgia', 'serif'], // Pour les titres
}
```

### Breakpoints (défaut Tailwind)

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT

### .env.local.example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx
CONTACT_EMAIL_TO=contact@arnault-janvier.fr

# Revalidation
REVALIDATE_TOKEN=your-secret-token

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=G-XXXXXXX

# Site URL
NEXT_PUBLIC_SITE_URL=https://arnault-janvier.fr
```

---

## ✅ CHECKLIST DE DÉVELOPPEMENT

### Phase 1 : Setup
- [ ] Créer le projet Next.js avec TypeScript
- [ ] Configurer Tailwind CSS
- [ ] Setup next-intl (i18n)
- [ ] Créer le projet Supabase
- [ ] Exécuter les migrations SQL
- [ ] Configurer les variables d'environnement
- [ ] Setup Vercel (preview deployments)

### Phase 2 : Frontend Public
- [ ] Layout global (Header, Footer, Navigation)
- [ ] LanguageSwitcher fonctionnel
- [ ] Page Accueil complète
- [ ] Page À propos
- [ ] Page Galerie avec filtres
- [ ] Page Projet détail
- [ ] Page Contact avec formulaire
- [ ] Lightbox pour images
- [ ] VideoEmbed (Instagram/YouTube)
- [ ] Responsive sur tous les breakpoints

### Phase 3 : Backend / API
- [ ] API route contact
- [ ] Envoi email avec Resend
- [ ] Rate limiting
- [ ] API revalidation

### Phase 4 : Back-office Admin
- [ ] Auth Supabase (login)
- [ ] Layout admin avec sidebar
- [ ] Dashboard (stats basiques)
- [ ] CRUD Projets
- [ ] Upload images vers Supabase Storage
- [ ] Gestion catégories
- [ ] Édition paramètres site

### Phase 5 : SEO & Performance
- [ ] Meta tags dynamiques
- [ ] Open Graph images
- [ ] Sitemap.xml généré
- [ ] Robots.txt
- [ ] Lighthouse > 90
- [ ] Images optimisées (next/image)

### Phase 6 : Finalisation
- [ ] Tests cross-browser
- [ ] Tests mobile
- [ ] Traductions EN complètes
- [ ] Traductions ES complètes
- [ ] Configuration domaine
- [ ] Go live 🚀

---

## 🚨 POINTS D'ATTENTION POUR L'AGENT IA

1. **Toujours utiliser TypeScript** avec des types stricts
2. **next-intl** : Utiliser `useTranslations()` pour tous les textes affichés
3. **Images** : Toujours utiliser `next/image` avec `width`, `height` ou `fill`
4. **Supabase** : Utiliser le bon client (browser vs server vs admin)
5. **RLS activé** : Les requêtes publiques ne voient que les données publiées
6. **Formulaires** : Toujours valider côté client ET serveur
7. **SEO** : Chaque page doit avoir ses propres metadata
8. **Accessibilité** : alt sur images, labels sur inputs, focus states
9. **Mobile-first** : Coder d'abord pour mobile, puis adapter vers desktop
10. **Commits atomiques** : Un commit = une fonctionnalité ou un fix

---

## 📝 COMMANDES UTILES

```bash
# Développement
npm run dev

# Build production
npm run build

# Linter
npm run lint

# Types check
npx tsc --noEmit

# Générer types Supabase
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts

# Preview build local
npm run build && npm run start
```

---

*Document généré pour le projet Arnault Janvier - Janvier 2026*

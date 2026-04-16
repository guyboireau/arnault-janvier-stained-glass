-- ============================================
-- Migration 004 : Catégories Arnault Janvier
-- Remplace les catégories génériques du seed initial
-- par les 6 catégories définies dans le devis.
-- ============================================

-- Supprimer les anciennes catégories (elles n'ont pas encore de projets associés)
DELETE FROM public.categories WHERE slug IN (
    'vitraux-religieux',
    'art-contemporain',
    'restauration',
    'decoration-interieure',
    'commandes-speciales'
);

-- ============================================
-- Section PROJETS (photos lieu d'installation)
-- ============================================
INSERT INTO public.categories (slug, name_fr, name_en, name_es, display_order, is_active) VALUES
    ('particuliers',  'Particuliers',  'Residential', 'Particulares',  1, true),
    ('retail',        'Retail',        'Retail',       'Comercio',      2, true),
    ('decoration',    'Décoration',    'Decoration',   'Decoración',    3, true)
ON CONFLICT (slug) DO UPDATE SET
    name_fr       = EXCLUDED.name_fr,
    name_en       = EXCLUDED.name_en,
    name_es       = EXCLUDED.name_es,
    display_order = EXCLUDED.display_order,
    is_active     = EXCLUDED.is_active;

-- ============================================
-- Section RÉALISATIONS (lieu + techniques)
-- ============================================
INSERT INTO public.categories (slug, name_fr, name_en, name_es, display_order, is_active) VALUES
    ('vitraux-ornementaux', 'Vitraux ornementaux',  'Ornamental stained glass', 'Vidrieras ornamentales', 4, true),
    ('vitreries',           'Vitreries',             'Glazing',                  'Cristalería',            5, true),
    ('vitraux-peints',      'Vitraux peints',        'Painted glass',            'Vidrio pintado',         6, true)
ON CONFLICT (slug) DO UPDATE SET
    name_fr       = EXCLUDED.name_fr,
    name_en       = EXCLUDED.name_en,
    name_es       = EXCLUDED.name_es,
    display_order = EXCLUDED.display_order,
    is_active     = EXCLUDED.is_active;

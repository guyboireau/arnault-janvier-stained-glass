export const CONTACT_INFO = {
    ateliers: [
        {
            label: 'Atelier MMAD',
            address: '23 cours Anatole France',
            city: '03000 Moulins',
        },
        {
            label: 'Atelier Paris',
            address: '26 rue Pixérécourt',
            city: '75020 Paris',
        },
    ],
    siege: {
        address: '45 rue des Saules',
        city: '75018 Paris',
    },
    email: 'arnault.janvier1@gmail.com',
    instagram: '@arnault.janvier',
    instagramUrl: 'https://instagram.com/arnault.janvier',
    horaires: 'Lundi – Vendredi, sur rendez-vous uniquement',
} as const;

// Groupes de catégories par section
export const PROJET_CATEGORY_SLUGS = ['particuliers', 'retail', 'decoration'] as const;
export const REALISATION_CATEGORY_SLUGS = ['vitraux-ornementaux', 'vitreries', 'vitraux-peints'] as const;

// Site settings key for press items
export const PRESS_ITEMS_SETTINGS_KEY = 'press_items';

export interface PressItem {
    id: string;
    title: string;
    publication: string;
    date: string;
    excerpt?: string;
    url?: string;
    cover_image_url?: string;
}

export const CONTACT_ATTACHMENT_BUCKET = 'contact-attachments';
export const CONTACT_ATTACHMENT_MAX_SIZE_MB = 5;
export const CONTACT_ATTACHMENT_MAX_FILES = 5;
export const CONTACT_ATTACHMENT_ACCEPTED = 'image/png,image/jpeg,application/pdf';

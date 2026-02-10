import { createClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';

interface SiteSettings {
    title_fr: string;
    title_en: string;
    title_es: string;
    description_fr: string;
    description_en: string;
    description_es: string;
    email: string;
    phone: string;
    address: string;
    instagram: string;
    youtube: string;
}

export default async function SettingsPage() {
    const supabase = createClient();

    // Default settings structure
    const defaultSettings: SiteSettings = {
        title_fr: 'Arnault Janvier - Maître Verrier',
        title_en: 'Arnault Janvier - Master Glazier',
        title_es: 'Arnault Janvier - Maestro Vidriero',
        description_fr: "Artisan vitrailliste à Paris. Création, restauration et personnalisation de vitraux d'art.",
        description_en: 'Stained glass artisan in Paris. Creation, restoration and customization of art glass.',
        description_es: 'Artesano vidriero en París. Creación, restauración y personalización de vidrieras artísticas.',
        email: 'contact@arnault-janvier.fr',
        phone: '',
        address: 'Paris, France',
        instagram: 'https://instagram.com/glassncraft',
        youtube: '',
    };

    // Fetch site settings
    const result = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_info')
        .maybeSingle();

    const settings: SiteSettings = ((result.data as any)?.value as SiteSettings) || defaultSettings;

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                    Site Settings
                </h1>
                <p className="text-neutral-600">
                    Manage your website configuration and contact information
                </p>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}


import { useTranslations } from 'next-intl';
import { getProjects, getCategories } from '@/lib/api';
import GalleryGrid from './GalleryGrid';

export default async function GalleryPage() {
    const t = useTranslations('Navigation'); // Or specific Gallery translations
    const projects = await getProjects();
    const categories = await getCategories();

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--accent-gold)] mb-4">
                    Galerie de Réalisations
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Découvrez une sélection de vitraux, de la création contemporaine à la restauration de patrimoine.
                </p>
            </div>

            <GalleryGrid projects={projects} categories={categories} />
        </div>
    );
}

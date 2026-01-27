import { useTranslations } from 'next-intl';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Database } from '@/types/database';

type Props = {
    params: { locale: string; slug: string };
};

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export async function generateMetadata({ params: { locale, slug } }: Props) {
    const supabase = createClient();
    const { data: project } = await supabase
        .from('projects')
        .select('title_fr, title_en, title_es, seo_description_fr, seo_description_en, seo_description_es')
        .eq('slug', slug)
        .single();

    if (!project) return { title: 'Projet introuvable' };

    const titleKey = `title_${locale}` as keyof typeof project;
    const descKey = `seo_description_${locale}` as keyof typeof project;

    // Hande explicit nulls with fallback
    const title = (project as any)[titleKey] || (project as any).title_fr || 'Project';
    const description = (project as any)[descKey] || (project as any).seo_description_fr || '';

    return {
        title: `${title} - Arnault Janvier`,
        description,
    };
}

export default async function ProjectDetailPage({ params: { locale, slug } }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('gallery.project');
    const tCommon = await getTranslations('common');

    const supabase = createClient();
    const { data: projectData } = await supabase
        .from('projects')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();

    // Mock data fallback if DB is empty/project not found (for dev/demo purposes solely)
    let project = projectData;
    if (!project && slug.startsWith('mock-')) {
        const mockId = slug === 'mock-1' ? '1' : '2';
        // Recreate the mock object from gallery page for consistency
        project = {
            id: mockId,
            slug: slug,
            title_fr: slug === 'mock-1' ? 'Cathédrale St Jean' : 'Villa Moderne',
            title_en: slug === 'mock-1' ? 'St John Cathedral' : 'Modern Villa',
            category: { name_fr: slug === 'mock-1' ? 'Restauration' : 'Contemporain' },
            description_fr: "Une description détaillée du projet...",
            content_fr: "Voici le contenu complet du projet, expliquant la démarche artistique, les techniques utilisées et les défis rencontrés lors de la réalisation.",
            year: 2024,
            location: "Paris, France",
            client_name: "Diocèse de Paris",
            cover_image_url: slug === 'mock-1' ? 'https://images.unsplash.com/photo-1596825205486-3cb3448a3182?q=80&w=2670' : 'https://images.unsplash.com/photo-1698652309736-4074c76a5eb2?q=80&w=2576',
            images: [],
            videos: []
        } as any;
    }

    if (!project) {
        notFound();
    }

    const p = project as Project & { category: Category };
    const title = (p as any)[`title_${locale}`] || p.title_fr;
    const description = (p as any)[`description_${locale}`] || p.description_fr;
    const content = (p as any)[`content_${locale}`] || p.content_fr;
    const categoryName = p.category ? ((p.category as any)[`name_${locale}`] || p.category.name_fr) : '';

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6">
                <Link href="/gallery" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('backToGallery')}
                </Link>

                <header className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div className="space-y-6">
                        {categoryName && (
                            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium tracking-wider uppercase rounded-full">
                                {categoryName}
                            </span>
                        )}
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-neutral-600 border-t border-neutral-200 pt-6">
                        {p.year && (
                            <div>
                                <span className="block font-medium text-neutral-900 mb-1">{t('year')}</span>
                                {p.year}
                            </div>
                        )}
                        {p.location && (
                            <div>
                                <span className="block font-medium text-neutral-900 mb-1">{t('location')}</span>
                                {p.location}
                            </div>
                        )}
                        {/* Client name could be protected/private, showing only if present */}
                        {p.client_name && (
                            <div>
                                <span className="block font-medium text-neutral-900 mb-1">Client</span>
                                {p.client_name}
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 shadow-xl mb-16">
                    {p.cover_image_url ? (
                        <Image
                            src={p.cover_image_url}
                            alt={title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                            No Image
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                        {description && (
                            <p className="text-xl leading-relaxed text-neutral-700 font-medium">
                                {description}
                            </p>
                        )}
                        {content && (
                            <div className="prose prose-lg prose-neutral max-w-none text-neutral-600">
                                {/* Security: If content comes from rich text editor, ensure it's sanitized or handle line breaks */}
                                {content.split('\n').map((line: string, i: number) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Additional Info or Gallery could go here */}
                    <div className="lg:col-span-4">
                        <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-100">
                            <h3 className="font-display text-xl font-bold mb-4">{tCommon('contact.title') || "Intéressé ?"}</h3>
                            <p className="text-neutral-600 mb-6">
                                {/* Fallback text if translation missing */}
                                Vous souhaitez réaliser un projet similaire ? Contactez-moi pour en discuter.
                            </p>
                            <Link href="/contact">
                                <Button className="w-full">
                                    {tCommon('contact.form.submit') || "Me contacter"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Images (Basic Grid for now, Lightbox later) */}
                {/* Check if p.images is array and has items */}
                {/* Implementation deferred to fully robust gallery handling */}
            </div>
        </div>
    );
}

import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Database } from '@/types/database';
import { getProjectImages } from '@/lib/project-helpers';
import ProjectGallery from '@/components/gallery/ProjectGallery';

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

    const title = (project as any)[`title_${locale}`] || (project as any).title_fr || 'Project';
    const description = (project as any)[`seo_description_${locale}`] || (project as any).seo_description_fr || '';

    return {
        title: `${title} - Arnault Janvier`,
        description,
    };
}

export default async function ProjectDetailPage({ params: { locale, slug } }: Props) {
    unstable_setRequestLocale(locale);
    const t = await getTranslations('gallery.project');
    const tContact = await getTranslations('contact');

    const supabase = createClient();
    const { data: projectData } = await supabase
        .from('projects')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .single();

    if (!projectData) {
        notFound();
    }

    const p = projectData as Project & { category: Category };
    const title = (p as any)[`title_${locale}`] || p.title_fr;
    const description = (p as any)[`description_${locale}`] || p.description_fr;
    const content = (p as any)[`content_${locale}`] || p.content_fr;
    const categoryName = p.category ? ((p.category as any)[`name_${locale}`] || p.category.name_fr) : '';

    // Fetch all project images from project_images table
    const projectImages = await getProjectImages(p.id);

    // Also check the images JSONB field as fallback
    let allImages: { url: string; alt: string }[] = [];

    if (projectImages.length > 0) {
        allImages = projectImages.map(img => ({
            url: img.image_url,
            alt: img.alt_text || title,
        }));
    } else if (p.images && Array.isArray(p.images) && p.images.length > 0) {
        allImages = (p.images as any[]).map(img => ({
            url: img.url,
            alt: img[`alt_${locale}`] || img.alt_fr || title,
        }));
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6">
                {/* Back button */}
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 transition-all shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('backToGallery')}</span>
                </Link>

                <header className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div className="space-y-6">
                        {categoryName && (
                            <span className="inline-block px-3 py-1 bg-gold-50 text-gold-700 text-sm font-medium tracking-wider uppercase rounded-full border border-gold-200">
                                {categoryName}
                            </span>
                        )}
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-neutral-600 border-t border-neutral-200 pt-6">
                        {p.year && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gold-500" />
                                <div>
                                    <span className="block font-medium text-neutral-900">{t('year')}</span>
                                    {p.year}
                                </div>
                            </div>
                        )}
                        {p.location && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gold-500" />
                                <div>
                                    <span className="block font-medium text-neutral-900">{t('location')}</span>
                                    {p.location}
                                </div>
                            </div>
                        )}
                        {p.client_name && (
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gold-500" />
                                <div>
                                    <span className="block font-medium text-neutral-900">Client</span>
                                    {p.client_name}
                                </div>
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
                    ) : allImages.length > 0 ? (
                        <Image
                            src={allImages[0].url}
                            alt={allImages[0].alt}
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-8 space-y-8">
                        {description && (
                            <p className="text-xl leading-relaxed text-neutral-700 font-medium">
                                {description}
                            </p>
                        )}
                        {content && (
                            <div className="prose prose-lg prose-neutral max-w-none text-neutral-600">
                                {content.split('\n').map((line: string, i: number) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-neutral-50 p-8 rounded-xl border border-neutral-100">
                            <h3 className="font-display text-xl font-bold mb-4">{tContact('subtitle')}</h3>
                            <p className="text-neutral-600 mb-6">
                                {tContact('form.messagePlaceholder')}
                            </p>
                            <Link href="/contact">
                                <Button className="w-full">
                                    {tContact('form.submit')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* All Project Images Gallery */}
                {allImages.length > 1 && <ProjectGallery images={allImages} />}

                {/* Bottom back button */}
                <div className="text-center pt-8 border-t border-neutral-200">
                    <Link href="/gallery">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            {t('backToGallery')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

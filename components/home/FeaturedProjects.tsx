import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getProjects } from '@/lib/api';
import ProjectCard from '@/components/gallery/ProjectCard';

export default async function FeaturedProjects({ locale }: { locale: string }) {
    const t = await getTranslations('home.featured');

    const projects = await getProjects();
    const featured = projects.filter((p: any) => p.is_featured).slice(0, 3);
    const displayProjects = featured.length > 0 ? featured : projects.slice(0, 3);

    return (
        <section className="py-24 bg-neutral-50">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-xl">
                        <h2 className="font-display text-4xl md:text-5xl mb-4 text-neutral-900">
                            {t('title')}
                        </h2>
                        <p className="text-xl text-neutral-600 font-light">
                            {t('subtitle')}
                        </p>
                    </div>

                    <Link
                        href="/gallery"
                        className="hidden md:inline-block text-sm uppercase tracking-widest font-medium border-b hover:border-black pb-1 transition-all"
                    >
                        {t('viewAll')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayProjects.map((project: any) => (
                        <ProjectCard key={project.id} project={project} locale={locale} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/gallery"
                        className="inline-block text-sm uppercase tracking-widest font-medium border-b pb-1"
                    >
                        {t('viewAll')}
                    </Link>
                </div>
            </div>
        </section>
    );
}

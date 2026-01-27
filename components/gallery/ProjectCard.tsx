import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Define a minimal Project type based on what we see in database schema
interface Project {
    slug: string;
    title: string;
    categories?: {
        name: string;
    };
    project_images?: {
        url: string;
    }[];
}

interface ProjectCardProps {
    project: Project;
    locale: string;
    priority?: boolean;
}

export default function ProjectCard({ project, locale, priority = false }: ProjectCardProps) {
    const t = useTranslations('gallery.project');

    const coverImage = project.project_images?.[0]?.url;

    return (
        <Link
            href={`/projects/${project.slug}`}
            className="group block relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded-sm"
        >
            {coverImage ? (
                <Image
                    src={coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400 bg-neutral-100">
                    <span className="text-sm uppercase tracking-widest">No Image</span>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4 text-center">
                <span className="text-xs uppercase tracking-widest mb-2 text-yellow-500">
                    {project.categories?.name}
                </span>
                <h3 className="font-display text-2xl mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {project.title}
                </h3>
                <span className="uppercase text-xs tracking-widest border border-white/50 px-4 py-2 hover:bg-white hover:text-black transition-colors">
                    {t('viewDetails')}
                </span>
            </div>

            {/* Mobile Title (visible if no hover capability, e.g. mobile, bottom gradient) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent md:hidden">
                <h3 className="text-white font-display text-lg">{project.title}</h3>
            </div>
        </Link>
    );
}

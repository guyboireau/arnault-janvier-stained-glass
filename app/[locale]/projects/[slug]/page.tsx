
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProjectBySlug } from '@/lib/api';
import { Link } from '@/i18n/routing';

import { Metadata } from 'next';

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        return {
            title: 'Projet introuvable',
        };
    }

    return {
        title: project.title,
        description: project.description.substring(0, 160),
        openGraph: {
            title: project.title,
            description: project.description.substring(0, 160),
            images: project.project_images?.[0] ? [{ url: project.project_images[0].url }] : [],
        },
    };
}

export default async function ProjectPage({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <Link href="/gallery" className="inline-flex items-center text-sm text-[color:var(--accent-gold)] mb-8 hover:underline">
                ← Retour à la galerie
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    {project.project_images?.[0] && (
                        <div className="aspect-[4/5] relative bg-slate-900 rounded-lg overflow-hidden mb-4">
                            <Image
                                src={project.project_images[0].url}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-4 gap-4">
                        {project.project_images?.slice(1).map((img: any) => (
                            <div key={img.id} className="aspect-square relative bg-slate-900 rounded overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                <Image
                                    src={img.url}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <span className="text-sm uppercase tracking-widest text-slate-500 block mb-2">
                            {project.categories?.name}
                        </span>
                        <h1 className="font-serif text-4xl text-white mb-6">{project.title}</h1>
                        <div className="prose prose-invert prose-lg text-slate-300 font-light">
                            <p>{project.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

interface ProjectGalleryProps {
    images: Array<{ url: string; alt: string }>;
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (images.length === 0) return null;

    return (
        <>
            <section className="mb-16">
                <h2 className="font-display text-2xl font-bold text-neutral-900 mb-8">
                    Galerie ({images.length} photo{images.length > 1 ? 's' : ''})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 group cursor-pointer"
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                                    Cliquer pour agrandir
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <Lightbox
                images={images}
                initialIndex={lightboxIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
}

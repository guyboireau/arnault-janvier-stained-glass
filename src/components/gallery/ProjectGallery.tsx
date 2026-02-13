'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Lightbox from './Lightbox';

interface ProjectGalleryProps {
    images: Array<{ url: string; alt: string }>;
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (images.length === 0) return null;

    const scrollThumbnails = (direction: 'left' | 'right') => {
        const container = document.getElementById('gallery-thumbnails');
        if (!container) return;
        const scrollAmount = 300;
        const newPosition = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;
        container.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
    };

    return (
        <>
            <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-bold text-neutral-900">
                        Galerie ({images.length} photo{images.length > 1 ? 's' : ''})
                    </h2>
                    {images.length > 4 && (
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scrollThumbnails('left')}
                                className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors"
                                aria-label="Défiler à gauche"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => scrollThumbnails('right')}
                                className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 transition-colors"
                                aria-label="Défiler à droite"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Thumbnail grid - compact layout */}
                <div
                    id="gallery-thumbnails"
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3"
                >
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 group cursor-pointer"
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Maximize2 className="h-5 w-5 text-white drop-shadow-lg" />
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

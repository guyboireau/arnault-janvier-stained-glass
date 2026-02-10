'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface InstagramPost {
    id: string;
    caption: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    mediaUrl: string;
    permalink: string;
    timestamp: string;
}

interface InstagramFeedAutoProps {
    username?: string;
    postsToShow?: number;
    title?: string;
    subtitle?: string;
}

export default function InstagramFeedAuto({
    username = 'glassncraft',
    postsToShow = 6,
    title = 'Suivez-moi sur Instagram',
    subtitle = 'Découvrez mes dernières créations et mon processus créatif',
}: InstagramFeedAutoProps) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchInstagramPosts();
    }, [postsToShow]);

    const fetchInstagramPosts = async () => {
        try {
            const response = await fetch(`/api/instagram?limit=${postsToShow}`);
            const data = await response.json();

            if (data.posts && Array.isArray(data.posts)) {
                setPosts(data.posts);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Failed to fetch Instagram posts:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const truncateCaption = (caption: string, maxLength: number = 100) => {
        if (caption.length <= maxLength) return caption;
        return caption.substring(0, maxLength).trim() + '...';
    };

    return (
        <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                        <Instagram className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                        {title}
                    </h2>
                    <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-6">
                        {subtitle}
                    </p>
                    <a
                        href={`https://instagram.com/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        <Instagram className="h-5 w-5" />
                        <span>@{username}</span>
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[...Array(postsToShow)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 mb-4">
                            Impossible de charger le flux Instagram pour le moment.
                        </p>
                        <a
                            href={`https://instagram.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
                        >
                            <Instagram className="h-5 w-5" />
                            Visitez notre Instagram
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                )}

                {/* Posts Grid */}
                {!loading && !error && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {posts.map((post, index) => (
                            <motion.a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100 shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                <Image
                                    src={post.mediaUrl}
                                    alt={post.caption || 'Instagram post'}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <p className="text-sm leading-relaxed">
                                            {truncateCaption(post.caption)}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
                                            <Instagram className="h-4 w-4" />
                                            <span>
                                                {new Date(post.timestamp).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <ExternalLink className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600 mb-4">
                            Aucun post Instagram disponible pour le moment.
                        </p>
                        <a
                            href={`https://instagram.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 font-medium"
                        >
                            <Instagram className="h-5 w-5" />
                            Suivez-nous sur Instagram
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

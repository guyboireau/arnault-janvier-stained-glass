'use client';

import { useEffect } from 'react';
import { Instagram } from 'lucide-react';

interface InstagramFeedProps {
    username?: string;
    postsToShow?: number;
    title?: string;
    subtitle?: string;
}

export default function InstagramFeed({
    username = 'glassncraft',
    postsToShow = 6,
    title = 'Suivez-moi sur Instagram',
    subtitle = 'Découvrez mes dernières créations et mon processus créatif',
}: InstagramFeedProps) {
    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        // Process embeds when script loads
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };

        return () => {
            // Cleanup
            document.body.removeChild(script);
        };
    }, []);

    // Instagram post URLs - These should be updated regularly
    // In a real implementation, you would fetch these from an API or database
    const instagramPosts = [
        'https://www.instagram.com/p/YOUR_POST_ID_1/',
        'https://www.instagram.com/p/YOUR_POST_ID_2/',
        'https://www.instagram.com/p/YOUR_POST_ID_3/',
        'https://www.instagram.com/p/YOUR_POST_ID_4/',
        'https://www.instagram.com/p/YOUR_POST_ID_5/',
        'https://www.instagram.com/p/YOUR_POST_ID_6/',
    ].slice(0, postsToShow);

    return (
        <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl mb-4">
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
                    </a>
                </div>

                {/* Instagram Embeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {instagramPosts.map((postUrl, index) => (
                        <div key={index} className="instagram-embed-wrapper">
                            <blockquote
                                className="instagram-media"
                                data-instgrm-captioned
                                data-instgrm-permalink={postUrl}
                                data-instgrm-version="14"
                                style={{
                                    background: '#FFF',
                                    border: '0',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                    margin: '1px',
                                    maxWidth: '100%',
                                    minWidth: '280px',
                                    padding: '0',
                                    width: 'calc(100% - 2px)',
                                }}
                            >
                                <a
                                    href={postUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        background: '#FFFFFF',
                                        lineHeight: '0',
                                        padding: '0 0',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        width: '100%',
                                    }}
                                >
                                    Voir cette publication sur Instagram
                                </a>
                            </blockquote>
                        </div>
                    ))}
                </div>

                {/* Alternative: Simple Image Grid (if embeds don't work) */}
                {/* This would require Instagram API integration */}
            </div>
        </section>
    );
}

// TypeScript declaration for Instagram embed
declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void;
            };
        };
    }
}

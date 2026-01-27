'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

export default function Hero() {
    const t = useTranslations('home.hero');

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image Placeholder - Replace with actual image later */}
            <div className="absolute inset-0 bg-neutral-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579783902614-a3fb3927d6a5?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
                >
                    {t('title')}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    {t('subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link href="/gallery">
                        <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 bg-white text-neutral-900 hover:bg-neutral-100">
                            {t('cta')}
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

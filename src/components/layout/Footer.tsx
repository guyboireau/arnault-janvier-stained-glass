'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    const t = useTranslations('footer');
    const tContact = useTranslations('contact');
    const tNav = useTranslations('navigation');

    return (
        <footer className="bg-neutral-900 text-neutral-300">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <h3 className="font-display text-2xl font-bold text-white">
                            <span className="tracking-[0.15em]">ARNAULT</span>{' '}
                            <span className="tracking-[0.15em] text-gold-400">JANVIER</span>
                        </h3>
                        <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
                            {t('brandDescription') || "Maître verrier passionné par la lumière et la couleur. Création et restauration de vitraux d'art."}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white tracking-wide uppercase text-sm">{tNav('home')}</h4>
                        {/* Using 'home' as a placeholder title for navigation section or use hardcoded 'Navigation' if translation missing */}
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">{tNav('home')}</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">{tNav('about')}</Link></li>
                            <li><Link href="/gallery" className="hover:text-white transition-colors">{tNav('gallery')}</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">{tNav('contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white tracking-wide uppercase text-sm">{tContact('title')}</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-gold-500 shrink-0" />
                                <span>Paris 18e, France</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gold-500 shrink-0" />
                                <a href="mailto:contact@arnault-janvier.fr" className="hover:text-white transition-colors">contact@arnault-janvier.fr</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gold-500 shrink-0" />
                                <span>+33 6 XX XX XX XX</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} Arnault Janvier. {t('rights')}.</p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link href="/legal" className="hover:text-white transition-colors">{t('legal')}</Link>
                        <span className="flex items-center">
                            {t('madeBy')} <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ml-1 text-white hover:underline">Guy Boireau</a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

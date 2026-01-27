import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Navigation');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 border-t border-white/5 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-serif text-[color:var(--accent-gold)] mb-4">ARNAULT JANVIER</h3>
                        <p className="text-slate-400 text-sm">
                            Création et restauration de vitraux d'art.
                            <br />
                            L'excellence du savoir-faire artisanal.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Navigation</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/" className="hover:text-white transition-colors">{t('home')}</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">{t('about')}</Link></li>
                            <li><Link href="/gallery" className="hover:text-white transition-colors">{t('gallery')}</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Contact</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="mailto:contact@arnaultjanvier.com" className="hover:text-[color:var(--accent-gold)] transition-colors">contact@arnaultjanvier.com</a></li>
                            {/* Add social links here */}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 text-center text-xs text-slate-600">
                    © {currentYear} Arnault Janvier. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

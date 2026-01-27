import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';

export default function Header() {
    const t = useTranslations('Navigation');

    return (
        <header className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-serif font-bold text-[color:var(--accent-gold)] tracking-wider">
                    ARNAULT JANVIER
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="hover:text-[color:var(--accent-gold)] transition-colors text-sm uppercase tracking-widest">{t('home')}</Link>
                    <Link href="/about" className="hover:text-[color:var(--accent-gold)] transition-colors text-sm uppercase tracking-widest">{t('about')}</Link>
                    <Link href="/gallery" className="hover:text-[color:var(--accent-gold)] transition-colors text-sm uppercase tracking-widest">{t('gallery')}</Link>
                    <Link href="/contact" className="hover:text-[color:var(--accent-gold)] transition-colors text-sm uppercase tracking-widest">{t('contact')}</Link>
                    <div className="w-px h-4 bg-white/20 mx-2"></div>
                    <LanguageSelector />
                </nav>

                {/* Mobile menu button placeholder */}
                <div className="md:hidden flex items-center gap-4">
                    <LanguageSelector />
                    <button className="p-2">
                        <span className="sr-only">Menu</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

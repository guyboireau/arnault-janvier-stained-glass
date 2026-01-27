
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
    const t = useTranslations('HomePage');

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center p-8 bg-[url('https://images.unsplash.com/photo-1542662565-7e4b66b5ad2c?auto=format&fit=crop&q=80')] bg-cover bg-center bg-no-repeat relative">
            <div className="absolute inset-0 bg-slate-950/70"></div>

            <div className="relative z-10 max-w-4xl space-y-8">
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wider text-white drop-shadow-lg">
                    {t('title')}
                </h1>
                <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto">
                    L&apos;excellence du verre, la passion de la lumière.
                </p>

                <div className="pt-8">
                    <Link
                        href="/gallery"
                        className="inline-block px-8 py-4 bg-[color:var(--accent-gold)] text-slate-950 font-serif font-bold tracking-widest text-sm hover:bg-[color:var(--accent-gold-hover)] transition-colors uppercase border border-transparent"
                    >
                        {t('cta')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

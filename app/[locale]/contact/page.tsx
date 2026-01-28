
import { useTranslations } from 'next-intl';

export default function ContactPage() {
    const t = useTranslations('Contact');

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h1 className="font-serif text-4xl text-[color:var(--accent-gold)] mb-6">{t('title')}</h1>
                    <p className="text-slate-300 mb-8 font-light">
                        {t('intro')}
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-1">{t('atelier')}</h3>
                            <p className="text-white">12 Rue de l&apos;Artisanat<br />75000 Paris</p>
                        </div>
                        <div>
                            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-1">{t('email')}</h3>
                            <a href="mailto:contact@arnaultjanvier.com" className="text-[color:var(--accent-gold)] hover:underline">
                                contact@arnaultjanvier.com
                            </a>
                        </div>
                        <div>
                            <h3 className="text-sm uppercase tracking-widest text-slate-500 mb-1">{t('phone')}</h3>
                            <p className="text-white">+33 6 12 34 56 78</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-lg border border-white/5">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">{t('form.name')}</label>
                            <input type="text" id="name" className="w-full bg-slate-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[color:var(--accent-gold)] transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">{t('form.email')}</label>
                            <input type="email" id="email" className="w-full bg-slate-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[color:var(--accent-gold)] transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">{t('form.message')}</label>
                            <textarea id="message" rows={5} className="w-full bg-slate-950 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[color:var(--accent-gold)] transition-colors"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-[color:var(--accent-gold)] text-slate-950 font-serif font-bold tracking-widest py-4 uppercase hover:bg-[color:var(--accent-gold-hover)] transition-colors">
                            {t('form.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

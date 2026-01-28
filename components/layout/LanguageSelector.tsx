'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSelector() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <select
            defaultValue={locale}
            onChange={handleChange}
            disabled={isPending}
            className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:border-[color:var(--accent-gold)]"
        >
            <option value="fr" className="text-black">FR</option>
            <option value="en" className="text-black">EN</option>
            <option value="es" className="text-black">ES</option>
        </select>
    );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { ChangeEvent, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const t = useTranslations('navigation');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (newLocale: Locale) => {
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors"
                aria-label="Change language"
            >
                <span className="text-xl leading-none">{localeFlags[locale as keyof typeof localeFlags]}</span>
                <span className="hidden md:inline text-sm font-medium uppercase text-neutral-700">{locale}</span>
                <ChevronDown className={cn("h-4 w-4 text-neutral-500 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-neutral-100 ring-1 ring-black ring-opacity-5 z-50">
                    {locales.map((cur) => (
                        <button
                            key={cur}
                            onClick={() => handleLanguageChange(cur)}
                            className={cn(
                                "flex items-center w-full px-4 py-2 text-sm text-left hover:bg-neutral-50",
                                locale === cur ? "bg-primary-50 text-primary-900 font-medium" : "text-neutral-700"
                            )}
                        >
                            <span className="mr-3 text-lg">{localeFlags[cur]}</span>
                            {localeNames[cur]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

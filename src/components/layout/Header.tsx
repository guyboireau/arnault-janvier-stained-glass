'use client';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/useScroll';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useEffect, useState } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link
                    href="/"
                    className={cn(
                        "font-display text-2xl font-bold tracking-tight z-50 transition-colors",
                        isScrolled ? "text-neutral-900" : "text-white"
                    )}
                >
                    <span className="tracking-[0.15em]">ARNAULT</span>{' '}
                    <span className={cn("tracking-[0.15em]", isScrolled ? "text-gold-600" : "text-gold-400")}>JANVIER</span>
                </Link>

                {/* Desktop Navigation */}
                <div className={cn("hidden md:flex items-center space-x-8", isScrolled ? "text-neutral-900" : "text-white")}>
                    {/* Custom Nav Implementation specific for header context colors if needed, but reusing Navigation component is better for generic structure. 
               However, Navigation component manages its own text colors. We might need to pass props or style it externally. 
               For now, let's wrap it.
           */}
                    <div className={cn(isScrolled ? "[&_a]:text-neutral-600 [&_a:hover]:text-gold-600 [&_.active]:text-gold-600" : "[&_a]:text-white/80 [&_a:hover]:text-gold-300 [&_.active]:text-gold-300")}>
                        <Navigation />
                    </div>

                    <div className={isScrolled ? "" : "text-white"}>
                        <LanguageSwitcher />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}

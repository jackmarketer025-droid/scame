
"use client";

import {Link} from '@/i18n/routing';
import { ShieldAlert, Search, Flag, Database, BookOpen, AlertCircle, Menu, X, Home, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  const navItems = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('verify'), href: '/check', icon: Search },
    { name: t('report'), href: '/report', icon: Flag },
    { name: t('database'), href: '/database', icon: Database },
    { name: t('awareness'), href: '/awareness', icon: BookOpen },
    { name: t('gallery'), href: '/gallery', icon: ImageIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-primary p-1.5 md:p-2 rounded-xl shadow-md">
            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-headline font-black text-lg md:text-xl tracking-tight text-primary">
              Scam Shield
            </span>
            <span className="font-headline font-black text-xs md:text-sm text-destructive uppercase tracking-widest">
              Command
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-[13px] xl:text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-muted/50"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <LanguageSwitcher />
          
          <Button 
            variant="destructive" 
            className="hidden sm:flex font-black bg-destructive hover:bg-destructive/90 rounded-full px-4 md:px-6 h-10 md:h-11 shadow-lg shadow-destructive/20 animate-pulse text-xs md:text-sm uppercase tracking-wider"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {t('emergency')}
          </Button>
          
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted font-bold text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full font-black bg-destructive h-14 rounded-xl uppercase tracking-widest"
              onClick={() => setIsMenuOpen(false)}
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {t('emergency')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

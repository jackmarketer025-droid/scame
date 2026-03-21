
"use client";

import { Link } from '@/i18n/routing';
import { Facebook, Youtube, Instagram, Phone, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-destructive" />
              <span className="font-headline font-bold text-2xl tracking-tight">
                Scam Shield
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-destructive transition-colors"><Facebook className="w-6 h-6" /></Link>
              <Link href="#" className="hover:text-destructive transition-colors"><Youtube className="w-6 h-6" /></Link>
              <Link href="#" className="hover:text-destructive transition-colors"><Instagram className="w-6 h-6" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-4 text-white/70 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">{t('links.dashboard')}</Link></li>
              <li><Link href="/check" className="hover:text-white transition-colors">{t('links.verify')}</Link></li>
              <li><Link href="/report" className="hover:text-white transition-colors">{t('links.report')}</Link></li>
              <li><Link href="/awareness" className="hover:text-white transition-colors">{t('links.awareness')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6">{t('policies')}</h4>
            <ul className="space-y-4 text-white/70 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">{t('policyLinks.privacy')}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t('policyLinks.terms')}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t('policyLinks.disclaimer')}</Link></li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="font-headline font-bold text-lg mb-4 text-destructive">{t('emergency')}</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/20 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-white/50">{t('btrcLabel')}</p>
                  <p className="font-bold text-lg">{t('btrcNumber')}</p>
                </div>
              </div>
              <p className="text-xs text-white/60">
                {t('emergencyDesc')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center text-white/40 text-xs">
          © {new Date().getFullYear()} {t('copyright')}
        </div>
      </div>
    </footer>
  );
}

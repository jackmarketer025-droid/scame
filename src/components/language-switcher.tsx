
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname, routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale as any });
  };

  const currentLanguage = languages.find(l => l.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 font-black text-primary hover:bg-primary/5 rounded-full px-4 md:px-6 h-10 md:h-11 border-2 border-primary/10 transition-all hover:border-primary/30"
        >
          <Globe className="w-4 h-4 text-primary/60" />
          <span className="hidden sm:inline text-sm">{currentLanguage.name}</span>
          <span className="sm:hidden text-xs">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3 opacity-40" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] rounded-2xl p-2 shadow-2xl border-none glass-card">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center justify-between cursor-pointer rounded-xl px-3 py-2.5 transition-colors ${locale === lang.code ? 'bg-primary/10 font-black text-primary' : 'hover:bg-primary/5'}`}
          >
            <span className="text-sm font-bold">{lang.name}</span>
            <span className="text-xl">{lang.flag}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

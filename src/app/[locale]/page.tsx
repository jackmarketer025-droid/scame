
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, Search, Users, Activity, Trophy, Briefcase, Banknote, 
  Zap, Heart, ShoppingCart, Lock, Bot, Plane, ShieldAlert, Flame, 
  AlertCircle, ShieldCheck as SafetyIcon, Info, ArrowRight 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { LiveTicker } from "@/components/scam/live-ticker";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useTranslations } from "next-intl";
import { ScamHeatmap } from "@/components/scam/scam-heatmap";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const dynamic = 'force-dynamic';

const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/,/g, "").replace("+", ""));

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{value.includes("+") ? "+" : ""}{suffix}</span>;
};

export default function Home() {
  const t = useTranslations("Home");
  const tc = useTranslations("Categories");
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  
  const stats = [
    { label: t("stats.blocked"), value: "10500+", icon: ShieldCheck, color: "text-green-500", glow: "neon-glow-green" },
    { label: t("stats.moneySaved"), value: "1500000", icon: Banknote, color: "text-primary", glow: "neon-glow-blue", suffix: t("stats.moneyValue").includes("$") ? "$" : "৳" },
    { label: t("stats.active"), value: "2420+", icon: Activity, color: "text-destructive", glow: "neon-glow-red" },
    { label: t("stats.helped"), value: "15000+", icon: Users, color: "text-orange-500", glow: "" },
  ];

  const categoryIcons = [Trophy, Briefcase, Banknote, ShieldAlert, Zap, Heart, ShoppingCart, Lock, Bot, Plane];
  const categoryColors = [
    "bg-purple-100 text-purple-600 shadow-purple-200",
    "bg-blue-100 text-blue-600 shadow-blue-200",
    "bg-amber-100 text-amber-600 shadow-amber-200",
    "bg-red-100 text-red-600 shadow-red-200",
    "bg-indigo-100 text-indigo-600 shadow-indigo-200",
    "bg-pink-100 text-pink-600 shadow-pink-200",
    "bg-emerald-100 text-emerald-600 shadow-emerald-200",
    "bg-orange-100 text-orange-600 shadow-orange-200",
    "bg-cyan-100 text-cyan-600 shadow-cyan-200",
    "bg-slate-100 text-slate-600 shadow-slate-200",
  ];

  const categories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => ({
    title: t(`categories.${idx}.title`),
    desc: t(`categories.${idx}.desc`),
    tag: t(`categories.${idx}.tag`),
    status: t(`categories.${idx}.status`),
    how: t(`categories.${idx}.how`),
    safety: t(`categories.${idx}.safety`),
    report: t(`categories.${idx}.report`),
    icon: categoryIcons[idx],
    colorStyle: categoryColors[idx]
  }));

  const trendingItems = [0, 1, 2].map(idx => ({
    title: t(`trending.items.${idx}.title`),
    desc: t(`trending.items.${idx}.desc`),
    tag: t(`trending.items.${idx}.tag`),
  }));

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/check?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const heroBg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="space-y-0 bg-[#F3F8FA]">
      <section className="relative bg-primary overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40 lg:pt-48 lg:pb-56">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          {heroBg && (
            <Image 
              src={heroBg.imageUrl}
              alt="Background"
              fill
              priority
              sizes="100vw"
              className="object-cover mix-blend-overlay"
              data-ai-hint={heroBg.imageHint}
            />
          )}
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-5 py-2 rounded-full text-xs md:text-sm font-black mb-8 md:mb-12 backdrop-blur-md border border-white/20 shadow-2xl">
            <Zap className="w-4 h-4 text-destructive animate-pulse" />
            <span className="uppercase tracking-widest">{t("liveCounter")}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-headline font-black text-white mb-8 md:mb-14 max-w-6xl mx-auto leading-[1] tracking-tighter">
            {t("heroTitle")}
          </h1>
          
          <div className="max-w-4xl mx-auto glass-card p-3 md:p-4 rounded-[2rem] md:rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row gap-3 md:gap-4 border-2 border-white/40">
            <div className="flex-1 flex items-center px-6 md:px-10 gap-4 py-3 md:py-0">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0 opacity-60" />
              <Input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t("placeholder")} 
                className="border-none shadow-none text-lg md:text-2xl focus-visible:ring-0 placeholder:text-muted-foreground/40 h-12 md:h-16 w-full font-bold"
              />
            </div>
            <Button 
              size="lg" 
              onClick={handleSearch}
              className="bg-destructive hover:bg-destructive/90 text-white rounded-2xl md:rounded-[2rem] px-10 md:px-16 font-black h-16 md:h-20 text-lg md:text-xl shadow-xl hover:shadow-destructive/40 transition-all pulse-red w-full md:w-auto uppercase tracking-widest"
            >
              {t("verifyButton")}
            </Button>
          </div>
        </div>
      </section>

      <LiveTicker />

      <section className="container mx-auto px-4 -mt-12 md:-mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <Card key={i} className={`border-none shadow-2xl glass-card transition-all duration-500 hover:-translate-y-4 hover:rotate-1 ${stat.glow} rounded-[2rem] group`}>
              <CardContent className="p-8 md:p-10 flex flex-col items-center text-center gap-4 md:gap-6">
                <div className={`p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-xl transition-transform group-hover:scale-110`}>
                  <stat.icon className={`w-8 h-8 md:w-10 md:h-10 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl md:text-5xl font-black text-primary font-headline tracking-tighter leading-none mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-32 container mx-auto px-4">
        <div className="space-y-12 md:space-y-20">
          <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-headline font-black text-primary flex items-center justify-center gap-4">
                <Flame className="w-10 h-10 md:w-14 md:h-14 text-destructive animate-bounce" />
                {t("trending.title")}
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium">{t("trending.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {trendingItems.map((item, i) => (
              <Card key={i} className="border-none shadow-2xl glass-card transition-all hover:-translate-y-3 overflow-hidden group rounded-[2.5rem]">
                <div className="h-3 bg-destructive/20 group-hover:bg-destructive/40 transition-colors" />
                <CardContent className="p-8 md:p-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <Badge variant="destructive" className="rounded-lg uppercase text-[10px] font-black tracking-widest px-4 py-1.5">{item.tag}</Badge>
                    <div className="w-10 h-10 rounded-full bg-destructive/5 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-destructive/40" />
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-primary leading-tight">{item.title}</h3>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                  <Button variant="link" className="p-0 h-auto font-black text-destructive text-lg group-hover:translate-x-2 transition-transform">
                    {t("trending.readMore")} →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 container mx-auto px-4 bg-white/40 border-y-4 border-primary/5 rounded-[4rem]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl md:text-5xl font-headline font-black text-primary flex items-center gap-4">
                <ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-destructive" />
                {t("sections.analysis")}
              </h2>
            </div>
            <ScamHeatmap />
          </div>

          <div className="lg:col-span-4 space-y-10">
            <h2 className="text-2xl md:text-3xl font-headline font-black text-primary border-l-8 border-destructive pl-6">{t("sections.categories")}</h2>
            <div className="grid grid-cols-1 gap-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((cat, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <Card className={`hover:shadow-3xl transition-all border-none glass-card p-2 rounded-[2rem] hover:-translate-x-2 shadow-2xl relative overflow-hidden cursor-pointer`}>
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-destructive text-white text-[8px] font-black animate-pulse rounded-full px-2 py-0.5">
                          {cat.status}
                        </Badge>
                      </div>
                      <CardContent className="p-6 md:p-8 flex items-center gap-6 md:gap-8">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shrink-0 ${cat.colorStyle} group-hover:rotate-12 transition-transform shadow-2xl`}>
                          <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-black text-primary mb-1 tracking-tight truncate">{cat.title}</h3>
                          <p className="text-[10px] md:text-xs font-bold text-muted-foreground/60 mb-2 truncate uppercase tracking-widest">{cat.tag}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{cat.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] rounded-[2rem] md:rounded-[3rem] border-none shadow-3xl overflow-hidden p-0">
                    <div className={`h-4 ${cat.colorStyle.split(' ')[0]} opacity-30`} />
                    <ScrollArea className="max-h-[calc(90vh-1rem)]">
                      <div className="p-6 md:p-12 space-y-8 md:space-y-10">
                        <DialogHeader className="space-y-6">
                          <div className="flex items-center gap-4 md:gap-6">
                            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${cat.colorStyle} shadow-xl shrink-0`}>
                              <cat.icon className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <DialogTitle className="text-2xl md:text-4xl font-black text-primary leading-tight tracking-tight truncate">
                                {cat.title}
                              </DialogTitle>
                              <Badge variant="destructive" className="uppercase text-[10px] font-black shrink-0">{cat.status}</Badge>
                            </div>
                          </div>
                        </DialogHeader>

                        <div className="grid gap-6 md:gap-8">
                          <div className="bg-destructive/5 p-6 md:p-8 rounded-[2rem] border-2 border-destructive/10 space-y-3">
                            <h4 className="text-base md:text-lg font-black text-destructive flex items-center gap-3 uppercase tracking-widest">
                              <AlertCircle className="w-6 h-6 shrink-0" /> {tc("how")}
                            </h4>
                            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed font-medium">{cat.how}</p>
                          </div>

                          <div className="bg-green-50 p-6 md:p-8 rounded-[2rem] border-2 border-green-100 space-y-3">
                            <h4 className="text-base md:text-lg font-black text-green-600 flex items-center gap-3 uppercase tracking-widest">
                              <SafetyIcon className="w-6 h-6 shrink-0" /> {tc("safety")}
                            </h4>
                            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed font-medium">{cat.safety}</p>
                          </div>

                          <div className="bg-primary/5 p-6 md:p-8 rounded-[2rem] border-2 border-primary/10 space-y-3">
                            <h4 className="text-base md:text-lg font-black text-primary flex items-center gap-3 uppercase tracking-widest">
                              <Info className="w-6 h-6 shrink-0" /> {tc("report")}
                            </h4>
                            <p className="text-muted-foreground text-sm md:text-lg leading-relaxed font-medium">{cat.report}</p>
                          </div>
                        </div>

                        <DialogFooter className="pt-4 md:pt-6">
                          <Button asChild className="w-full h-14 md:h-16 rounded-2xl font-black text-base md:text-lg bg-destructive hover:bg-destructive/90 shadow-xl shadow-destructive/20 pulse-red">
                            <Link href="/report">{tc("reportThis")}</Link>
                          </Button>
                        </DialogFooter>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              ))}
              <Button variant="outline" asChild className="w-full rounded-[1.5rem] md:rounded-[2rem] h-16 md:h-20 font-black text-lg border-2 border-primary/10 hover:bg-primary/5 transition-all shadow-xl uppercase tracking-widest sticky bottom-0 bg-white">
                <Link href="/categories">{t("sections.viewAll")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

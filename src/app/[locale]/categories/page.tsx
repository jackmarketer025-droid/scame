
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Trophy, Briefcase, Banknote, ShieldAlert, Zap, 
  Heart, ShoppingCart, Lock, Bot, Plane, 
  Info, ShieldCheck, AlertCircle, ArrowRight
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CategoriesPage() {
  const t = useTranslations("Home");
  const tc = useTranslations("Categories");

  const categoryIcons = [
    Trophy, Briefcase, Banknote, ShieldAlert, Zap, 
    Heart, ShoppingCart, Lock, Bot, Plane
  ];

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

  const allCategories = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => ({
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

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F3F8FA]">
      <div className="space-y-12 md:space-y-20">
        <div className="text-center space-y-4">
          <Badge className="bg-destructive text-white px-6 py-2 rounded-full uppercase font-black tracking-widest shadow-xl mb-4">Command Library</Badge>
          <h1 className="text-4xl md:text-7xl font-headline font-black text-primary tracking-tighter leading-none">
            {tc("title")}
          </h1>
          <p className="text-muted-foreground text-lg md:text-2xl font-bold max-w-3xl mx-auto opacity-70">
            {tc("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {allCategories.map((cat, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <Card className="border-none shadow-3xl glass-card transition-all hover:-translate-y-3 overflow-hidden group rounded-[3rem] cursor-pointer">
                  <div className={`h-3 ${cat.colorStyle.split(' ')[0]} opacity-30 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-8 md:p-12 space-y-8 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shrink-0 ${cat.colorStyle} group-hover:rotate-12 transition-transform shadow-2xl`}>
                        <cat.icon className="w-10 h-10 md:w-12 md:h-12" />
                      </div>
                      <Badge variant="destructive" className="rounded-lg uppercase text-[10px] font-black tracking-widest px-4 py-1.5 animate-pulse">
                        {cat.status}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl md:text-4xl font-black text-primary leading-tight tracking-tight">{cat.title}</h3>
                      <div className="inline-block bg-primary/5 px-4 py-1 rounded-full">
                         <span className="text-xs md:text-sm font-black text-primary/60 uppercase tracking-widest">{cat.tag}</span>
                      </div>
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                        {cat.desc}
                      </p>
                      <Button variant="link" className="p-0 font-black text-destructive uppercase tracking-widest text-xs">
                        {tc("viewDetails")} <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] rounded-[2rem] md:rounded-[3rem] border-none shadow-3xl overflow-hidden p-0">
                <div className={`h-4 ${cat.colorStyle.split(' ')[0]}`} />
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
                          <Badge variant="destructive" className="uppercase text-[10px] font-black">{cat.status}</Badge>
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
                          <ShieldCheck className="w-6 h-6 shrink-0" /> {tc("safety")}
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
        </div>
      </div>
    </div>
  );
}

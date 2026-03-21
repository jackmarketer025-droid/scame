
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, FileText, CheckCircle, ExternalLink, Shield, ImageIcon, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useTranslations } from "next-intl";
import { RecoveryGuide } from "@/components/scam/recovery-guide";
import { Link } from "@/i18n/routing";

export const dynamic = 'force-dynamic';

export default function AwarenessPage() {
  const t = useTranslations("Awareness");
  
  const resources = [
    { title: "How to spot fake websites?", desc: "10 easy ways to identify fake websites.", date: "MAY 25, 2024" },
    { title: "Ways to avoid Social Media hacks", desc: "Guide on two-step verification and strong passwords.", date: "MAY 20, 2024" },
    { title: "Preventing fraud in Mobile Banking", desc: "PIN safety and OTP security measures.", date: "MAY 15, 2024" }
  ];

  const downloads = [
    { title: "Awareness Poster (PDF)", size: "1.2 MB" },
    { title: "Leaflet: Protection from Scams", size: "500 KB" },
    { title: "Emergency Helpline List", size: "200 KB" }
  ];

  const rules = [
    "Never share OTP or PIN with anyone.",
    "Verify any offer on our portal before accepting.",
    "Report immediately if anything seems suspicious."
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-24">
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-headline font-black text-primary">{t("title")}</h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-bold opacity-70">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-primary flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-destructive" /> {t("blogTitle")}
              </h2>
            </div>
            <div className="grid gap-8">
              {resources.map((res, i) => {
                const placeholder = PlaceHolderImages[i % PlaceHolderImages.length];
                return (
                  <Card key={i} className="group hover:shadow-3xl transition-all border-none shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-[2rem]">
                    <div className="relative w-full md:w-64 h-64">
                      {placeholder && (
                        <Image 
                          src={placeholder.imageUrl} 
                          alt={res.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 256px"
                          className="object-cover group-hover:scale-105 transition-transform"
                          data-ai-hint={placeholder.imageHint}
                        />
                      )}
                    </div>
                    <CardContent className="p-8 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-destructive uppercase tracking-[0.2em]">{res.date}</span>
                        <Button variant="ghost" size="icon" className="group-hover:text-primary"><ExternalLink className="w-5 h-5" /></Button>
                      </div>
                      <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">{res.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{res.desc}</p>
                      <Button variant="link" className="p-0 h-auto font-black text-primary text-lg">{t("readMore")}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-12">
            <Card className="bg-primary text-white border-none shadow-3xl rounded-[2.5rem] overflow-hidden">
              <div className="h-3 bg-destructive" />
              <CardContent className="p-10 space-y-8">
                <Shield className="w-16 h-16 text-destructive" />
                <h3 className="text-3xl font-black leading-tight">{t("goldenRules")}</h3>
                <ul className="space-y-6">
                  {rules.map((text, i) => (
                    <li key={i} className="flex gap-4 text-lg font-bold">
                      <CheckCircle className="w-6 h-6 text-destructive shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-black text-primary flex items-center gap-4 px-2">
              <Download className="w-7 h-7 text-destructive" /> {t("downloadTitle")}
            </h2>
            <div className="space-y-4">
              {downloads.map((dl, i) => (
                <Card key={i} className="border-none shadow-xl hover:bg-muted/30 transition-colors rounded-[1.5rem]">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg">{dl.title}</h4>
                      <p className="text-sm text-muted-foreground font-bold">{dl.size}</p>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-2"><Download className="w-5 h-5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-4 border-primary/10 bg-white rounded-[2rem] p-8 space-y-6 shadow-2xl">
              <ImageIcon className="w-12 h-12 text-primary" />
              <h4 className="text-2xl font-black text-primary leading-tight">Visit our Visual Proof Gallery</h4>
              <p className="text-muted-foreground font-bold">See real vs fake bKash and Bank SMS side by side.</p>
              <Button asChild className="w-full h-14 rounded-xl font-black text-lg bg-primary">
                <Link href="/gallery">Open Gallery <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <div id="recovery">
        <RecoveryGuide />
      </div>
    </div>
  );
}

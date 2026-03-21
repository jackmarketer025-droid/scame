
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Info, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function GalleryPage() {
  const t = useTranslations("Gallery");

  const comparisons = [
    {
      title: t("bKash.title"),
      desc: t("bKash.desc"),
      realImg: PlaceHolderImages[0].imageUrl,
      fakeImg: PlaceHolderImages[1].imageUrl,
      notes: [
        "Official IDs like 'bKash' or '16247' are always real.",
        "Scammers use numbers like +88017... or fake business names.",
        "Real messages never include shortened bit.ly links for login."
      ]
    },
    {
      title: t("bank.title"),
      desc: t("bank.desc"),
      realImg: PlaceHolderImages[2].imageUrl,
      fakeImg: PlaceHolderImages[3].imageUrl,
      notes: [
        "Official banks use unique alphabetic senders (eg. DBBL, CITYBANK).",
        "Fake alerts often use urgent language to create panic.",
        "Real banks will never ask for your PIN via an SMS link."
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F3F8FA]">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <Badge className="bg-primary text-white px-6 py-2 rounded-full uppercase font-black tracking-widest shadow-xl mb-4">Visual Proof</Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-black text-primary tracking-tighter">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-bold max-w-2xl mx-auto opacity-70">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-24">
          {comparisons.map((comp, i) => (
            <div key={i} className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-primary/5 pb-8">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black text-primary">{comp.title}</h2>
                  <p className="text-muted-foreground font-bold">{comp.desc}</p>
                </div>
                <Badge variant="outline" className="h-10 px-6 rounded-full font-black border-2 border-primary/20 text-primary uppercase">
                  Case Study #0{i + 1}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden group">
                  <div className="bg-green-500 py-4 px-8 text-white font-black flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {t("real")}
                  </div>
                  <CardContent className="p-0 relative aspect-video">
                    <Image 
                      src={comp.realImg} 
                      alt="Real Example" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden group border-4 border-destructive/20">
                  <div className="bg-destructive py-4 px-8 text-white font-black flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> {t("fake")}
                  </div>
                  <CardContent className="p-0 relative aspect-video">
                    <Image 
                      src={comp.fakeImg} 
                      alt="Fake Example" 
                      fill 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 border-[12px] border-destructive/30 pointer-events-none m-4 rounded-[1.5rem]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 border-destructive/60 rounded-full flex items-center justify-center -rotate-12">
                      <span className="text-destructive text-xl font-black uppercase">SCAM</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white border-none shadow-2xl rounded-[2rem] p-8 md:p-12">
                <h3 className="text-2xl font-black text-primary flex items-center gap-4 mb-8">
                  <Info className="w-8 h-8 text-destructive" /> {t("spotDifference")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {comp.notes.map((note, idx) => (
                    <div key={idx} className="space-y-3 p-6 bg-primary/5 rounded-2xl border-l-8 border-destructive">
                      <div className="font-black text-destructive text-lg">Point #{idx + 1}</div>
                      <p className="text-muted-foreground font-bold leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

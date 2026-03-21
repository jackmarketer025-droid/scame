
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneCall, FileText, History, ShieldAlert, ArrowRight } from "lucide-react";

export function RecoveryGuide() {
  const t = useTranslations("Recovery");

  const steps = [
    { icon: PhoneCall, title: t("step1"), desc: t("step1Desc"), color: "bg-red-500" },
    { icon: FileText, title: t("step2"), desc: t("step2Desc"), color: "bg-orange-500" },
    { icon: History, title: t("step3"), desc: t("step3Desc"), color: "bg-primary" },
  ];

  return (
    <Card className="border-4 border-destructive/20 shadow-3xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-white">
      <CardHeader className="bg-destructive/5 p-8 md:p-12 text-center border-b-4 border-white">
        <div className="w-20 h-20 bg-destructive text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl pulse-red">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <CardTitle className="text-3xl md:text-5xl font-black text-primary leading-tight">
          {t("title")}
        </CardTitle>
        <p className="text-lg md:text-xl font-bold text-muted-foreground mt-4 opacity-70">
          {t("subtitle")}
        </p>
      </CardHeader>
      <CardContent className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="space-y-6 group text-center md:text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${step.color} text-white shadow-xl mx-auto md:mx-0 group-hover:rotate-6 transition-transform`}>
                <step.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-primary">{step.title}</h4>
                <p className="text-muted-foreground font-bold leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-12 border-t-4 border-primary/5 flex flex-col md:flex-row gap-6">
          <Button size="lg" className="flex-1 h-16 md:h-20 rounded-[2rem] font-black text-xl bg-destructive hover:bg-destructive/90 shadow-xl shadow-destructive/20" asChild>
            <a href="tel:999"><PhoneCall className="mr-4 w-8 h-8" /> {t("callNow")} (999)</a>
          </Button>
          <Button size="lg" variant="outline" className="flex-1 h-16 md:h-20 rounded-[2rem] font-black text-xl border-4 border-primary/10 hover:bg-primary/5 shadow-xl">
            Download Full Guide <ArrowRight className="ml-4 w-8 h-8" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

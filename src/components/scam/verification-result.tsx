
"use client";

import { useEffect, useState } from "react";
import { AiVerificationExplanationOutput } from "@/ai/flows/ai-verification-explanation-flow";
import { AlertCircle, ShieldAlert, AlertTriangle, ArrowRight, ShieldCheck, PhoneCall, ExternalLink, XCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { RecoveryGuide } from "./recovery-guide";

interface VerificationResultProps {
  result: AiVerificationExplanationOutput;
  target: string;
}

const RiskMeter = ({ riskLevel }: { riskLevel: 'Low' | 'Medium' | 'High' }) => {
  const [rotation, setRotation] = useState("-90deg");

  useEffect(() => {
    // Animate needle after component mount
    const timer = setTimeout(() => {
      if (riskLevel === 'Low') setRotation("-60deg");
      else if (riskLevel === 'Medium') setRotation("0deg");
      else setRotation("60deg");
    }, 500);
    return () => clearTimeout(timer);
  }, [riskLevel]);

  return (
    <div className="relative w-48 h-24 md:w-64 md:h-32 overflow-hidden mx-auto mb-8">
      {/* Background arc */}
      <div className="absolute inset-0 rounded-t-full border-[12px] border-slate-200"></div>
      {/* Color segments */}
      <div className="absolute inset-0 rounded-t-full border-[12px] border-transparent border-t-green-500 origin-bottom scale-[1.01] -rotate-[45deg] opacity-40"></div>
      <div className="absolute inset-0 rounded-t-full border-[12px] border-transparent border-t-orange-500 origin-bottom scale-[1.01] rotate-[0deg] opacity-40"></div>
      <div className="absolute inset-0 rounded-t-full border-[12px] border-transparent border-t-destructive origin-bottom scale-[1.01] rotate-[45deg] opacity-40"></div>
      
      {/* Needle */}
      <div 
        className="risk-needle absolute bottom-0 left-1/2 w-1 h-20 md:h-28 bg-primary rounded-full" 
        style={{ transform: `translateX(-50%) rotate(${rotation})` }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-lg"></div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800 rounded-full border-4 border-white"></div>
    </div>
  );
};

export function VerificationResult({ result, target }: VerificationResultProps) {
  const t = useTranslations("Verification");
  const { toast } = useToast();
  const isHighRisk = result.riskLevel === 'High';
  const isMediumRisk = result.riskLevel === 'Medium';
  const isSafe = !isHighRisk && !isMediumRisk;
  
  const handleDownloadAlert = () => {
    toast({
      title: "Downloading Alert PDF...",
      description: "Generating your secure report document.",
    });
  };

  const getIcon = () => {
    if (isHighRisk) return <XCircle className="w-16 h-16 md:w-24 md:h-24 text-destructive" />;
    if (isMediumRisk) return <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-orange-500" />;
    return <ShieldCheck className="w-16 h-16 md:w-24 md:h-24 text-green-500" />;
  };

  const getStatusColor = () => {
    if (isHighRisk) return "neon-glow-red bg-destructive/5 border-destructive/40";
    if (isMediumRisk) return "bg-orange-50/50 border-orange-200";
    return "neon-glow-green bg-green-50/50 border-green-200";
  };

  return (
    <div className={`space-y-12 md:space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700 relative p-4 md:p-8 rounded-[3rem] ${isHighRisk ? 'bg-danger-glow' : 'bg-safe-glow'}`}>
      <Card className={`border-4 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-3xl transition-all ${getStatusColor()}`}>
        <CardContent className="p-8 md:p-20">
          <div className="flex flex-col items-center gap-4 md:gap-8 text-center">
            <RiskMeter riskLevel={result.riskLevel} />
            <div className={`shrink-0 p-8 md:p-12 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] ${isHighRisk ? 'ring-8 ring-destructive/10' : ''}`}>
              {getIcon()}
            </div>
            <div className="space-y-4 md:space-y-8 max-w-3xl">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Badge variant={isHighRisk ? "destructive" : "outline"} className={`px-6 md:px-10 py-2 md:py-3 font-black text-xs md:text-base uppercase tracking-[0.2em] rounded-full shadow-xl ${isHighRisk ? 'pulse-red' : ''}`}>
                  {result.riskLevel} Risk Detected
                </Badge>
              </div>
              <div className="space-y-4">
                <h2 className={`text-4xl md:text-7xl font-black font-headline leading-[1.1] tracking-tighter ${isHighRisk ? 'text-destructive' : isSafe ? 'text-green-700' : 'text-orange-700'}`}>
                  {isHighRisk ? "ALERT! REPORTED 50+ TIMES!" : result.summaryExplanation}
                </h2>
                <div className="inline-block bg-white/60 backdrop-blur-md px-8 md:px-12 py-3 md:py-4 rounded-3xl border border-white shadow-inner">
                  <p className="font-mono text-base md:text-2xl text-primary font-black break-all opacity-80">
                    {target}
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={handleDownloadAlert}
                  variant="outline" 
                  className="rounded-full h-12 md:h-14 px-8 md:px-10 font-black uppercase tracking-widest border-2 hover:bg-primary hover:text-white transition-all"
                >
                  <Download className="mr-2 w-5 h-5" /> Download Alert PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <Card className="border-none shadow-3xl glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            <CardHeader className="border-b border-primary/5 p-6 md:p-10 bg-white/50">
              <CardTitle className="flex items-center gap-4 text-primary font-black text-xl md:text-3xl">
                <AlertCircle className="w-8 h-8 text-destructive" />
                {t("aiAnalysis")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <p className="text-muted-foreground leading-relaxed text-lg md:text-2xl whitespace-pre-wrap font-medium">
                {result.detailedExplanation}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-3xl bg-slate-900 text-white rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            <CardHeader className="bg-white/5 p-6 md:p-10">
              <CardTitle className="flex items-center gap-4 font-black text-xl md:text-3xl">
                <ShieldAlert className="w-8 h-8 text-destructive animate-pulse" />
                {t("actionPlan")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <ul className="grid grid-cols-1 gap-6 md:gap-10">
                {result.actionableAdvice.map((advice, i) => (
                  <li key={i} className="flex gap-6 items-start group">
                    <div className="bg-destructive/20 text-destructive p-3 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-destructive group-hover:text-white transition-all shadow-lg">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                    <span className="text-lg md:text-2xl font-bold opacity-90 leading-tight pt-1">{advice}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 md:space-y-12">
          {isHighRisk && (
            <Card className="border-4 border-destructive bg-destructive/5 shadow-3xl rounded-[2rem] md:rounded-[3rem] pulse-red overflow-hidden">
              <div className="h-4 bg-destructive animate-pulse" />
              <CardHeader className="p-8 md:p-10">
                <CardTitle className="text-destructive font-black text-2xl md:text-4xl leading-tight">TAKE ACTION: REPORT TO AUTHORITIES?</CardTitle>
                <p className="text-sm md:text-base font-bold text-destructive/70 mt-4 uppercase tracking-widest">{t("reportDesc")}</p>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-8 md:p-10 pt-0">
                <div className="grid gap-4">
                  <Button className="w-full h-16 md:h-20 bg-destructive hover:bg-destructive/90 font-black text-lg md:text-2xl rounded-2xl md:rounded-3xl shadow-2xl hover:scale-105 transition-transform uppercase tracking-widest" asChild>
                    <a href="tel:100">
                      <PhoneCall className="mr-4 w-6 h-6 md:w-8 md:h-8" /> {t("btrc")}
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full h-16 md:h-20 border-4 border-destructive/20 text-destructive font-black rounded-2xl md:rounded-3xl text-lg hover:bg-destructive/5 uppercase tracking-widest" asChild>
                    <a href="https://cyberpolice.gov.bd" target="_blank">
                      <ExternalLink className="mr-4 w-6 h-6" /> {t("cyberPolice")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-none shadow-3xl glass-card rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            <div className="h-3 bg-primary/10" />
            <CardHeader className="p-8 md:p-10">
              <CardTitle className="text-primary font-black text-xl md:text-3xl">{t("communityReport")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center py-10 md:py-16">
              <div className="relative inline-block">
                <div className="text-6xl md:text-8xl font-black text-primary tracking-tighter">52+</div>
                <div className="absolute -top-4 -right-8 bg-destructive text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">HOT</div>
              </div>
              <p className="text-sm md:text-xl text-muted-foreground font-black uppercase tracking-widest opacity-60 px-6">{t("last24h")}</p>
              <div className="pt-8">
                <Button variant="link" className="text-destructive font-black text-lg h-auto p-0 hover:translate-x-2 transition-transform">
                  {t("viewHistory")} →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isHighRisk && <RecoveryGuide />}
    </div>
  );
}

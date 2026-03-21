
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, AlertCircle, Info, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

export function ScamHeatmap() {
  const t = useTranslations("Heatmap");

  const districts = [
    { name: t("districts.Dhaka"), risk: "High", count: "1200+", color: "bg-red-500", glow: "neon-glow-red" },
    { name: t("districts.Chittagong"), risk: "Medium", count: "450+", color: "bg-orange-500", glow: "" },
    { name: t("districts.Sylhet"), risk: "Medium", count: "310+", color: "bg-orange-500", glow: "" },
    { name: t("districts.Rajshahi"), risk: "Low", count: "150+", color: "bg-green-500", glow: "" },
    { name: t("districts.Khulna"), risk: "Medium", count: "270+", color: "bg-orange-500", glow: "" },
    { name: t("districts.Barisal"), risk: "Low", count: "120+", color: "bg-green-500", glow: "" },
  ];

  return (
    <Card className="border-none shadow-2xl glass-card overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-4 md:p-6 border-b border-white/10">
        <div className="flex justify-between items-center gap-2">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-headline">
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-destructive animate-pulse shrink-0" />
            <span className="truncate">{t("title")}</span>
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[10px] font-black text-white/40 uppercase tracking-widest">Live Monitoring</span>
            <Badge variant="destructive" className="animate-pulse shrink-0 text-[10px] md:text-xs uppercase font-black">{t("liveUpdate")}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Command Center Style Map Area */}
          <div className="p-6 md:p-10 bg-[#0A0F1E] relative flex flex-col items-center justify-center min-h-[400px] md:min-h-[550px] overflow-hidden">
            <div className="scan-line"></div>
            
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative w-full max-w-[280px] md:max-w-sm aspect-[4/5] bg-primary/20 rounded-[2rem] md:rounded-[3rem] border-2 border-primary/40 flex items-center justify-center overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-destructive via-transparent to-transparent animate-pulse"></div>
                
                {/* Simulated Heatmap Pulse Points */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-8 bg-destructive/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-orange-500/40 rounded-full animate-ping delay-700"></div>
                
                <div className="z-10 text-center space-y-4 px-4">
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-destructive/20 relative shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                    <MapPin className="w-10 h-10 md:w-16 md:h-16 text-destructive animate-bounce" />
                    <div className="absolute inset-0 rounded-full border-4 border-destructive/20 animate-ping"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-headline font-black text-xs md:text-sm text-white uppercase tracking-[0.3em]">{t("loading")}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Scanning Network Segments...</p>
                  </div>
                </div>
            </div>
            
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span className="text-[10px] text-white/80 font-black uppercase tracking-wider">{t("risks.High")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] text-white/80 font-black uppercase tracking-wider">{t("risks.Medium")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-white/80 font-black uppercase tracking-wider">{t("risks.Low")}</span>
                </div>
              </div>
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Info className="w-4 h-4 text-white/60" />
              </div>
            </div>
          </div>

          <div className="p-4 md:p-10 space-y-6 md:space-y-8 bg-white/50">
            <div className="flex items-center justify-between border-b border-primary/5 pb-4">
              <h3 className="text-lg md:text-xl font-headline font-black text-primary flex items-center gap-3">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-destructive" /> {t("districtRisk")}
              </h3>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Regional Breakdown</span>
            </div>
            <div className="space-y-3">
              {districts.map((district, i) => (
                <div key={i} className={`flex items-center justify-between p-4 md:p-6 rounded-2xl bg-white transition-all border border-transparent hover:border-primary/20 group shadow-lg hover:shadow-2xl ${district.glow}`}>
                  <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0 mr-4">
                    <div className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 rounded-full shrink-0 ${district.color} shadow-xl shadow-black/10 flex items-center justify-center`}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-40 animate-pulse"></div>
                    </div>
                    <span className="font-black text-primary text-sm md:text-xl truncate tracking-tight">{district.name}</span>
                  </div>
                  <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none mb-1">{t("reports")}</p>
                      <p className="font-black text-primary text-sm md:text-base">{district.count}</p>
                    </div>
                    <Badge className={`px-3 md:px-5 py-1.5 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-tighter ${district.risk === 'High' ? 'bg-destructive text-white shadow-lg shadow-destructive/30' : district.risk === 'Medium' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-green-500 text-white shadow-lg shadow-green-500/20'}`}>
                      {t(`risks.${district.risk}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

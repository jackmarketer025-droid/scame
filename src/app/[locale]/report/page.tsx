"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Send, ShieldCheck, Instagram, MessageSquare, Phone, Globe, FileUp, Image as ImageIcon, Mic, FileText, ShieldAlert } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    scamType: "",
    targetId: "",
    description: "",
    isAnonymous: true,
  });
  const { toast } = useToast();
  const t = useTranslations("Report");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.scamType) {
        toast({
          title: "নির্বাচন প্রয়োজন",
          description: "দয়া করে একটি স্ক্যামের ধরণ নির্বাচন করুন।",
          variant: "destructive",
        });
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.targetId.trim() || !formData.description.trim()) {
        toast({
          title: "তথ্য প্রয়োজন",
          description: "দয়া করে নাম্বার/লিংক এবং বিস্তারিত বর্ণনা প্রদান করুন।",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    setIsLoading(true);
    const { firestore } = getFirebase();
    const reportId = `report_${Date.now()}`;
    const reportRef = doc(firestore, 'reports', reportId);
    
    const data = {
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    };

    setDoc(reportRef, data)
      .then(() => {
        setStep(5); // Success step
        toast({
          title: t("successTitle"),
          description: t("successDesc"),
        });
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: reportRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const scamTypes = [
    { id: "Social Media", label: "Social Media", icon: Instagram, color: "text-pink-500", bg: "bg-pink-50" },
    { id: "SMS", label: "SMS Scam", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "Phone Call", label: "Fake Call", icon: Phone, color: "text-green-500", bg: "bg-green-50" },
    { id: "Website", label: "Website", icon: Globe, color: "text-primary", bg: "bg-primary/5" },
  ];

  if (step === 5) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24 flex items-center justify-center">
        <Card className="max-w-md w-full text-center p-8 md:p-12 border-none shadow-3xl glass-card rounded-[3rem]">
          <CardContent className="p-0 space-y-8">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-black text-primary">{t("successTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-bold">{t("successDesc")}</p>
            </div>
            <Button className="w-full h-16 rounded-[2rem] font-black text-lg bg-primary hover:bg-primary/90 shadow-xl" onClick={() => setStep(1)}>{t("reportAnother")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 bg-[#F3F8FA]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 md:mb-20 space-y-6 md:space-y-10 text-center">
          <Badge className="bg-destructive text-white px-6 py-2 rounded-full uppercase font-black tracking-[0.2em] shadow-xl pulse-red">Security Command</Badge>
          <h1 className="text-4xl md:text-7xl font-headline font-black text-primary leading-none tracking-tighter">{t("title")}</h1>
          <p className="text-muted-foreground text-lg md:text-2xl font-bold max-w-2xl mx-auto opacity-70">{t("subtitle")}</p>
          <div className="max-w-xl mx-auto space-y-4">
            <Progress value={progress} className="h-4 rounded-full bg-white/50 border-2 border-primary/5 shadow-inner" />
            <div className="flex justify-between text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">
              <span className={step >= 1 ? "text-destructive" : ""}>{t("steps.type")}</span>
              <span className={step >= 2 ? "text-destructive" : ""}>{t("steps.details")}</span>
              <span className={step >= 3 ? "text-destructive" : ""}>{t("steps.evidence")}</span>
              <span className={step >= 4 ? "text-destructive" : ""}>{t("steps.submit")}</span>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-3xl glass-card rounded-[3rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="min-h-[500px] md:min-h-[650px] flex flex-col">
              <div className="flex-1 bg-white/30 backdrop-blur-sm">
                {step === 1 && (
                  <div className="p-8 md:p-20 space-y-10 md:space-y-16 animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight">{t("scamTypeTitle")}</h2>
                      <p className="text-lg md:text-xl text-muted-foreground font-bold opacity-60">{t("scamTypeSubtitle")}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                      {scamTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setFormData({ ...formData, scamType: type.id });
                            setStep(2);
                          }}
                          className={`p-8 md:p-12 border-4 ${formData.scamType === type.id ? 'border-destructive' : 'border-transparent'} rounded-[2.5rem] hover:border-destructive transition-all text-left space-y-6 group bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 flex flex-col items-center sm:items-start text-center sm:text-left`}
                        >
                          <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center ${type.bg} group-hover:scale-110 transition-transform shadow-2xl group-hover:rotate-6`}>
                            <type.icon className={`w-8 h-8 md:w-12 md:h-12 ${type.color}`} />
                          </div>
                          <div className="space-y-2">
                            <span className="font-black text-2xl md:text-4xl block text-primary leading-none">{type.label}</span>
                            <span className="text-[10px] md:text-xs text-muted-foreground font-black tracking-widest uppercase opacity-40">Identify Channel</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="p-8 md:p-20 space-y-10 md:space-y-16 animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight">{t("scammerInfoTitle")}</h2>
                      <p className="text-lg md:text-xl text-muted-foreground font-bold opacity-60">{t("scammerInfoSubtitle")}</p>
                    </div>
                    <div className="space-y-8 md:space-y-12">
                      <div className="space-y-5">
                        <Label className="text-xl md:text-2xl font-black text-primary flex items-center gap-3">
                          <Globe className="w-6 h-6 text-destructive" /> {t("labelId")}
                        </Label>
                        <Input 
                          value={formData.targetId}
                          onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                          placeholder={t("placeholderId")} 
                          className="h-16 md:h-24 rounded-[2rem] border-4 border-primary/5 text-xl md:text-3xl px-8 font-bold focus-visible:ring-destructive/20 focus-visible:border-destructive transition-all shadow-inner bg-slate-50/50" 
                        />
                      </div>
                      <div className="space-y-5">
                        <Label className="text-xl md:text-2xl font-black text-primary flex items-center gap-3">
                          <ShieldAlert className="w-6 h-6 text-destructive" /> {t("labelDesc")}
                        </Label>
                        <Textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder={t("placeholderDesc")} 
                          className="min-h-[200px] md:min-h-[300px] rounded-[2rem] border-4 border-primary/5 text-lg md:text-2xl p-8 font-bold focus-visible:ring-destructive/20 focus-visible:border-destructive transition-all shadow-inner bg-slate-50/50" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="p-8 md:p-20 space-y-10 md:space-y-16 animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="space-y-3 text-center sm:text-left">
                      <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight">EVIDENCE VAULT</h2>
                      <p className="text-lg md:text-xl text-muted-foreground font-bold opacity-60">Upload proof to strengthen your report.</p>
                    </div>
                    <div className="border-8 border-dashed border-primary/10 rounded-[4rem] p-12 md:p-32 text-center space-y-10 hover:border-destructive/40 hover:bg-destructive/5 transition-all cursor-pointer group relative shadow-[inset_0_0_50px_rgba(0,0,0,0.02)]">
                      <div className="w-24 h-24 md:w-36 md:h-36 bg-destructive text-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-3xl relative">
                        <FileUp className="w-12 h-12 md:w-20 md:h-20" />
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-destructive text-xl font-black shadow-2xl border-4 border-destructive/10 animate-pulse">!</div>
                      </div>
                      <div className="space-y-4">
                        <p className="font-black text-3xl md:text-6xl text-primary leading-none">{t("selectFile")}</p>
                        <p className="text-base md:text-2xl text-muted-foreground font-black opacity-40 uppercase tracking-[0.3em]">{t("dropFile")}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 pt-12 md:pt-20">
                        <div className="flex flex-col items-center gap-4 group/icon">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-3xl flex items-center justify-center text-pink-500 shadow-xl group-hover/icon:-translate-y-2 transition-transform">
                            <ImageIcon className="w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-primary/60">Screenshots</span>
                        </div>
                        <div className="flex flex-col items-center gap-4 group/icon">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-500 shadow-xl group-hover/icon:-translate-y-2 transition-transform">
                            <Mic className="w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-primary/60">Audio Recs</span>
                        </div>
                        <div className="flex flex-col items-center gap-4 group/icon">
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-500 shadow-xl group-hover/icon:-translate-y-2 transition-transform">
                            <FileText className="w-8 h-8 md:w-10 md:h-10" />
                          </div>
                          <span className="text-xs md:text-sm font-black uppercase tracking-widest text-primary/60">PDF / Docs</span>
                        </div>
                      </div>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="p-8 md:p-20 space-y-10 md:space-y-16 animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="space-y-3">
                      <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight">{t("settingsTitle")}</h2>
                      <p className="text-lg md:text-xl text-muted-foreground font-bold opacity-60">{t("settingsSubtitle")}</p>
                    </div>
                    <RadioGroup 
                      defaultValue={formData.isAnonymous ? "anonymous" : "public"} 
                      onValueChange={(val) => setFormData({ ...formData, isAnonymous: val === 'anonymous' })}
                      className="grid gap-6 md:gap-10"
                    >
                      <div className="flex items-center space-x-6 md:space-x-10 p-8 md:p-12 bg-white border-4 border-transparent rounded-[2.5rem] hover:border-destructive transition-all cursor-pointer group shadow-xl">
                        <RadioGroupItem value="anonymous" id="r1" className="h-8 w-8 md:h-12 md:w-12 border-4" />
                        <Label htmlFor="r1" className="flex-1 cursor-pointer space-y-2">
                          <span className="font-black text-2xl md:text-4xl block text-primary leading-none">{t("anonymous")}</span>
                          <span className="text-base md:text-xl text-muted-foreground font-bold opacity-60">{t("anonymousDesc")}</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-6 md:space-x-10 p-8 md:p-12 bg-white border-4 border-transparent rounded-[2.5rem] hover:border-destructive transition-all cursor-pointer group shadow-xl">
                        <RadioGroupItem value="public" id="r2" className="h-8 w-8 md:h-12 md:w-12 border-4" />
                        <Label htmlFor="r2" className="flex-1 cursor-pointer space-y-2">
                          <span className="font-black text-2xl md:text-4xl block text-primary leading-none">{t("public")}</span>
                          <span className="text-base md:text-xl text-muted-foreground font-bold opacity-60">{t("publicDesc")}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>

              <div className="p-8 md:p-16 bg-white/50 border-t-4 border-white flex flex-col-reverse md:flex-row justify-between items-center gap-6">
                {step > 1 ? (
                  <Button variant="ghost" size="lg" onClick={handleBack} disabled={isLoading} className="font-black text-2xl text-primary hover:bg-white rounded-2xl px-12 h-16 md:h-24 w-full md:w-auto">
                    <ArrowLeft className="w-8 h-8 mr-4" /> {t("back")}
                  </Button>
                ) : <div className="hidden md:block" />}
                
                {step < 4 ? (
                  <Button size="lg" onClick={handleNext} className="bg-primary hover:bg-primary/90 font-black px-16 h-16 md:h-24 rounded-2xl md:rounded-3xl shadow-3xl w-full md:w-auto text-xl md:text-3xl">
                    {t("next")} <ArrowRight className="w-8 h-8 ml-4" />
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleSubmit} disabled={isLoading} className="bg-destructive hover:bg-destructive/90 px-24 h-16 md:h-24 rounded-2xl md:rounded-3xl font-black text-xl md:text-3xl shadow-3xl shadow-destructive/20 w-full md:w-auto pulse-red">
                    {isLoading ? t("submitting") : t("submitBtn")} <Send className="w-8 h-8 ml-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

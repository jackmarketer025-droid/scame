
"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Globe, Phone, History, Info, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { aiVerificationExplanation } from "@/ai/flows/ai-verification-explanation-flow";
import { VerificationResult } from "@/components/scam/verification-result";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function CheckContent() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const t = useTranslations("Check");
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setInput(query);
      const timer = setTimeout(() => {
        handleVerify(query);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleVerify = async (val?: string) => {
    const target = val || input;
    if (!target.trim()) {
      toast({
        title: "ইনপুট দিন",
        description: "দয়া করে একটি ইউআরএল বা মোবাইল নাম্বার দিন।",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const isUrl = target.includes(".") || target.startsWith("http");
      
      const aiInput = {
        verificationTarget: target,
        verificationType: isUrl ? 'url' as const : 'mobile_number' as const,
      };

      const response = await aiVerificationExplanation(aiInput);
      setResult(response);
    } catch (error) {
      toast({
        title: "ভুল হয়েছে",
        description: "AI এনালাইসিস করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-headline font-black text-primary tracking-tighter">{t("title")}</h1>
          <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto font-medium opacity-70">{t("subtitle")}</p>
        </div>

        <div className="bg-white p-5 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-3xl border-4 border-primary/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            <div className="flex-1 relative">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="h-16 md:h-20 pl-14 md:pl-16 text-lg md:text-2xl rounded-2xl md:rounded-3xl border-4 border-primary/5 focus-visible:ring-primary/20 bg-slate-50/50 font-bold"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <div className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2">
                {input.includes('.') ? <Globe className="text-primary/40 w-6 h-6 md:w-8 md:h-8" /> : <Phone className="text-primary/40 w-6 h-6 md:w-8 md:h-8" />}
              </div>
            </div>
            <Button 
              size="lg" 
              className="h-16 md:h-20 px-8 md:px-14 rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl w-full md:w-auto bg-primary shadow-xl hover:shadow-primary/20 transition-all uppercase tracking-widest"
              onClick={() => handleVerify()}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <Search className="mr-3 h-6 w-6" />}
              {t("button")}
            </Button>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground/60 font-black uppercase tracking-widest">
            <span className="flex items-center gap-2"><History className="w-4 h-4 shrink-0 text-destructive" /> {t("recent")}: bit.ly/3x8Z, +88019...</span>
            <span className="flex items-center gap-2"><Info className="w-4 h-4 shrink-0 text-primary" /> {t("privacy")}</span>
          </div>
        </div>

        {result && <VerificationResult result={result} target={input} />}

        {!result && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 pt-12 md:pt-16">
            <div className="p-8 md:p-10 rounded-[2rem] bg-green-50 border-2 border-green-100 space-y-4 shadow-xl hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-green-700 text-lg md:text-xl leading-tight">Safe: ভেরিফাইড ব্র্যান্ড</h4>
                <p className="text-xs md:text-sm text-green-600/70 font-bold leading-relaxed">অফিসিয়াল এবং ট্রাস্টেড সোর্স থেকে ভেরিফাই করা।</p>
              </div>
            </div>
            <div className="p-8 md:p-10 rounded-[2rem] bg-orange-50 border-2 border-orange-100 space-y-4 shadow-xl hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                <AlertTriangle className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-orange-700 text-lg md:text-xl leading-tight">Suspicious: নতুন বা আনভেরিফাইড</h4>
                <p className="text-xs md:text-sm text-orange-600/70 font-bold leading-relaxed">AI মাধ্যমে সন্দেহজনক কিছু পাওয়া গেছে। সাবধানতা অবলম্বন করুন।</p>
              </div>
            </div>
            <div className="p-8 md:p-10 rounded-[2rem] bg-red-50 border-2 border-red-100 space-y-4 shadow-xl hover:-translate-y-2 transition-transform">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg">
                <ShieldAlert className="w-6 h-6 md:w-10 md:h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-red-700 text-lg md:text-xl leading-tight">Scam: ব্ল্যাকলিস্টেড</h4>
                <p className="text-xs md:text-sm text-red-600/70 font-bold leading-relaxed">ইতিমধ্যে রিপোর্ট করা হয়েছে। এই নাম্বার বা লিংকে ক্লিক করবেন না।</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <CheckContent />
    </Suspense>
  );
}

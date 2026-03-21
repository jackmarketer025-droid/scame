
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Globe, Phone, History, Info, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { aiVerificationExplanation } from "@/ai/flows/ai-verification-explanation-flow";
import { VerificationResult } from "@/components/scam/verification-result";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export default function CheckPageClient() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const t = useTranslations("Check");

  const handleVerify = async () => {
    if (!input.trim()) {
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
      const isUrl = input.includes(".") || input.startsWith("http");
      
      const aiInput = {
        verificationTarget: input,
        verificationType: isUrl ? 'url' as const : 'mobile_number' as const,
        suspicionDetails: [
          "অত্যন্ত নতুন ডোমেইন (৩ দিন আগে কেনা)",
          "ইউজার রিপোর্টে ব্ল্যাকলিস্টেড",
          "এসএসএল (SSL) সার্টিফিকেট ভ্যালিড নয়"
        ],
        whoisData: { creationDate: "2024-05-20", registrar: "NameCheap" }
      };

      const response = await aiVerificationExplanation(aiInput);
      setResult(response);
    } catch (error) {
      toast({
        title: "ভুল হয়েছে",
        description: "ফলাফল আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
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
          <h1 className="text-3xl md:text-4xl font-headline font-black text-primary">{t("title")}</h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl border-4 border-primary/5">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="h-14 md:h-16 pl-12 md:pl-14 text-base md:text-xl rounded-xl md:rounded-2xl border-2 focus-visible:ring-primary/20"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2">
                {input.includes('.') ? <Globe className="text-primary w-5 h-5 md:w-6 md:h-6" /> : <Phone className="text-primary w-5 h-5 md:w-6 md:h-6" />}
              </div>
            </div>
            <Button 
              size="lg" 
              className="h-14 md:h-16 px-8 md:px-12 rounded-xl md:rounded-2xl font-bold text-base md:text-lg w-full md:w-auto"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
              {t("button")}
            </Button>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><History className="w-4 h-4 shrink-0" /> {t("recent")}: bit.ly/3x8Z, +88019...</span>
            <span className="flex items-center gap-1.5"><Info className="w-4 h-4 shrink-0" /> {t("privacy")}</span>
          </div>
        </div>

        {result && <VerificationResult result={result} target={input} />}

        {!result && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-8 md:pt-12">
            <div className="p-5 md:p-6 rounded-2xl bg-green-50 border border-green-100 space-y-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h4 className="font-bold text-green-700 text-sm md:text-base">Safe: ভেরিফাইড ব্র্যান্ড</h4>
              <p className="text-[10px] md:text-xs text-green-600/70 leading-relaxed">অফিসিয়াল এবং ট্রাস্টেড সোর্স থেকে ভেরিফাই করা।</p>
            </div>
            <div className="p-5 md:p-6 rounded-2xl bg-orange-50 border border-orange-100 space-y-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h4 className="font-bold text-orange-700 text-sm md:text-base">Suspicious: নতুন বা আনভেরিফাইড</h4>
              <p className="text-[10px] md:text-xs text-orange-600/70 leading-relaxed">AI মাধ্যমে সন্দেহজনক কিছু পাওয়া গেছে। সাবধানতা অবলম্বন করুন।</p>
            </div>
            <div className="p-5 md:p-6 rounded-2xl bg-red-50 border border-red-100 space-y-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h4 className="font-bold text-red-700 text-sm md:text-base">Scam: ব্ল্যাকলিস্টেড</h4>
              <p className="text-[10px] md:text-xs text-red-600/70 leading-relaxed">ইতিমধ্যে রিপোর্ট করা হয়েছে। এই নাম্বার বা লিংকে ক্লিক করবেন না।</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

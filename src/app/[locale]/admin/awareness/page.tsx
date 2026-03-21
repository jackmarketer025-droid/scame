"use client";
import { useState, useEffect } from "react";
import { getFirebase, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Loader2, Send, FileText, Calendar, Layout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AwarenessAdmin() {
  const [formData, setFormData] = useState({ title: "", desc: "", date: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: userLoading } = useUser();
  const { firestore } = getFirebase();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desc || !formData.date) {
        toast({
            title: "তথ্য অসম্পূর্ণ",
            description: "সবগুলো ঘর পূরণ করুন।",
            variant: "destructive"
        })
        return;
    }
    
    setIsLoading(true);
    try {
      await addDoc(collection(firestore, "awareness_resources"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "সফল হয়েছে",
        description: "নতুন সচেতনতামূলক পোস্ট পাবলিশ করা হয়েছে।",
      })
      setFormData({ title: "", desc: "", date: "" });
    } catch (error) {
      console.error("Error adding awareness doc:", error);
      toast({
        title: "ত্রুটি",
        description: "পোস্ট পাবলিশ করতে সমস্যা হয়েছে। আপনার কি এডমিন এক্সেস আছে?",
        variant: "destructive"
      })
    } finally {
        setIsLoading(false);
    }
  };

  if (userLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 bg-[#F3F8FA]">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-primary">Awareness Hub Admin</h1>
              <p className="text-muted-foreground font-bold">Create educational content for citizens.</p>
            </div>

            <Card className="border-none shadow-3xl glass-card rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-primary text-white p-8">
                  <CardTitle className="flex items-center gap-3">
                    <Layout className="w-6 h-6" /> Create New Article
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Title (টাইটেল)
                          </label>
                          <Input
                              placeholder="যেমন: বিকাশ পিন কেন শেয়ার করবেন না"
                              value={formData.title}
                              onChange={(e) => setFormData({...formData, title: e.target.value})}
                              disabled={isLoading}
                              className="h-14 rounded-xl border-2 border-primary/5 focus-visible:ring-primary/20 font-bold"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
                            <Layout className="w-4 h-4" /> Description (বিস্তারিত)
                          </label>
                          <Textarea
                              placeholder="স্ক্যাম থেকে বাঁচার উপায় বিস্তারিত লিখুন..."
                              value={formData.desc}
                              onChange={(e) => setFormData({...formData, desc: e.target.value})}
                              disabled={isLoading}
                              rows={8}
                              className="rounded-xl border-2 border-primary/5 focus-visible:ring-primary/20 font-medium text-lg p-6"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Display Date (তারিখ)
                          </label>
                          <Input
                              placeholder="যেমন: ২০ মার্চ ২০২৬"
                              value={formData.date}
                              onChange={(e) => setFormData({...formData, date: e.target.value})}
                              disabled={isLoading}
                              className="h-14 rounded-xl border-2 border-primary/5 focus-visible:ring-primary/20 font-bold"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isLoading} 
                          className="w-full h-16 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-lg shadow-xl uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
                            পাবলিশ করুন
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

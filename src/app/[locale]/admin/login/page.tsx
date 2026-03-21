'use client';

import { useState, useEffect } from 'react';
import { getFirebase, useUser } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Loader2, Mail, Lock, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const t = useTranslations('Login');
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading && user) {
      router.replace('/admin');
    }
  }, [user, userLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { auth } = getFirebase();
    
    if (!auth) {
      toast({
        title: "Error",
        description: "Firebase Authentication is not initialized.",
        variant: "destructive",
      });
      return;
    }

    if (!email || !password) {
      toast({
        title: "তথ্য দিন",
        description: "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রয়োজন।",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "সফল হয়েছে",
        description: "অ্যাডমিন প্যানেলে প্রবেশ করা হচ্ছে...",
      });
      // Force immediate redirect to prevent hanging
      router.push('/admin');
    } catch (error: any) {
      console.error('Login Error:', error);
      let message = "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "ভুল ইমেইল বা পাসওয়ার্ড দেওয়া হয়েছে।";
      } else if (error.code === 'auth/network-request-failed') {
        message = "নেটওয়ার্ক কানেকশন চেক করুন।";
      } else {
        message = error.message || "একটি অজানা সমস্যা হয়েছে।";
      }
      
      toast({
        title: "প্রবেশাধিকার নেই",
        description: message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F8FA]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="font-bold text-primary animate-pulse tracking-widest uppercase text-xs">Initializing Secure Access...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F8FA]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="font-bold text-primary">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center bg-[#F3F8FA]">
      <Card className="max-w-md w-full border-none shadow-3xl glass-card rounded-[3rem] overflow-hidden">
        <CardHeader className="bg-primary text-white p-12 text-center">
          <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-black">{t('title')}</CardTitle>
          <p className="text-white/60 mt-2 font-bold">{t('subtitle')}</p>
        </CardHeader>
        <CardContent className="p-12 space-y-8 bg-white">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-3">
              <Label className="font-black text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </Label>
              <Input 
                type="email" 
                placeholder="admin@scamshield.gov" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-14 rounded-xl border-2 border-primary/5 font-bold focus-visible:ring-primary/20"
              />
            </div>
            <div className="space-y-3">
              <Label className="font-black text-primary uppercase tracking-widest text-xs flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="h-14 rounded-xl border-2 border-primary/5 font-bold focus-visible:ring-primary/20"
              />
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black text-lg flex items-center justify-center gap-4 shadow-xl transition-all uppercase tracking-widest"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          <div className="pt-4 text-center">
            <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">
              Secure Command Access Only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

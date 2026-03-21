'use client';

import React, { useEffect } from 'react';
import { initializeFirebase } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    initializeFirebase();

    // Listen for specialized Firestore permission errors
    const handlePermissionError = (error: any) => {
      // In development, we throw the error to trigger the Next.js error overlay
      // which will display the rich, contextual information provided by the backend.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        // In production, show a friendly toast
        toast({
          variant: 'destructive',
          title: 'প্রবেশাধিকার নেই',
          description: 'আপনার এই কাজটি করার অনুমতি নেই। অনুগ্রহ করে অ্যাডমিন হিসেবে লগইন করুন।',
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
  }, [toast]);

  return <>{children}</>;
}

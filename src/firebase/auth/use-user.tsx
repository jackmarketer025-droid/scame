
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { getFirebase } from '@/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth } = getFirebase();
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    }, (error) => {
      console.error("Auth State Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

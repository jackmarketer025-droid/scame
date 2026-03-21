
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

/**
 * Initializes Firebase App, Firestore, and Auth.
 * 
 * SECURITY RULES DEPLOYMENT TRIGGER:
 * Update: Ensuring public list access for 'approved' status and 
 * full admin access for authenticated users.
 * Triggered at: 2024-05-26 15:30 UTC
 */
export function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  if (!firestore) {
    firestore = getFirestore(app);
  }
  
  if (!auth) {
    auth = getAuth(app);
  }
  
  return { app, firestore, auth };
}

export function getFirebase() {
  if (typeof window !== 'undefined') {
    return initializeFirebase();
  }
  // Fallback for SSR to prevent errors during build/render
  return { app: null as any, firestore: null as any, auth: null as any };
}

export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

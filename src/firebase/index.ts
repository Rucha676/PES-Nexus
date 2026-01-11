'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore; } {
  const isConfigAvailable = firebaseConfig && firebaseConfig.projectId;

  if (!isConfigAvailable) {
    throw new Error('Firebase config is not available');
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  // Set persistence on the client side
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence);
  }
  const firestore = getFirestore(app);

  return {
    firebaseApp: app,
    auth: auth,
    firestore: firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';

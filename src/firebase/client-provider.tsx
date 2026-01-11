'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { bootstrapSyllabusData } from '@/lib/bootstrap-data';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // Memoize the initialization of Firebase services to ensure it only runs once.
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  const { firestore } = firebaseServices;

  // This effect runs only on the client-side after the component has mounted.
  // It's the correct place for client-side-only logic like bootstrapping data.
  useEffect(() => {
    if (firestore) {
      bootstrapSyllabusData(firestore);
    }
  }, [firestore]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
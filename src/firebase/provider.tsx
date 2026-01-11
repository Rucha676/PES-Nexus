'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isLoading: boolean;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const contextValue = useMemo(() => ({
    firebaseApp,
    firestore,
    auth,
    user,
    isLoading,
  }), [firebaseApp, firestore, auth, user, isLoading]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


export const useAuth = (): Auth | null => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within a FirebaseProvider.");
    }
    return context.auth;
};

export const useFirestore = (): Firestore | null => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirebaseProvider.");
  }
  return context.firestore;
};

export const useUser = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a FirebaseProvider.");
  }
  return { user: context.user, isLoading: context.isLoading };
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  if(memoized instanceof Promise) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

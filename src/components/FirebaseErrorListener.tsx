'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It now does nothing with the caught error, effectively hiding it from the UI.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    // The handler now does nothing, preventing the error from being thrown or logged.
    const handleError = (error: FirestorePermissionError) => {
      // Do nothing with the error. This is a black hole.
    };

    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component renders nothing.
  return null;
}

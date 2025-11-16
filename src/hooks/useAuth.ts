// 2. Create this new folder and file: src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This listener checks for login/logout
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  return { user, isLoading };
}
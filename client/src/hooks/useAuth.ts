import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange } from "@/lib/firebase";
import { handleAuthRedirect } from "@/lib/firebase-redirect";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result on page load
    handleAuthRedirect().catch(console.error);

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
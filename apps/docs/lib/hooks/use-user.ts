import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
}

interface UserHook {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function useUser(): UserHook {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      // Fetch current user from your API
      const response = await fetch('/api/user');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      
      const userData = await response.json();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // Function to refetch user data
  const mutate = () => {
    fetchUser();
  };

  return { user, isLoading, error, mutate };
}

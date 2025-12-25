"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { me } from "@/api/auth";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  namespace?: string;
  namespace_id?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await me();

      if (response.status === 200) {
        const userData = response.data as User;

        setUser(userData);
      } else {
        // If user is not authenticated, clear user data
        if (response.status === 401) {
          setUser(null);
        } else {
          throw new Error("Failed to fetch user data");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  // Check for existing session on mount
  useEffect(() => {
    if (pathname !== "/login") {
      fetchUser();
    }
  }, [pathname]);

  const value = {
    user,
    isLoading,
    error,
    fetchUser,
    clearUser,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

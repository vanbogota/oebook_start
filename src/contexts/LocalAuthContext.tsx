"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseEnv, supabase } from "@/lib/supabaseClient";

export type UserProfile = {
  uid: string;
  email: string;
  library: string;
  country: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type AuthContextType = {
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  updateUserProfile: (data: Partial<Pick<UserProfile, "library" | "country">>) => Promise<void>;
  createUserProfile: (
    email: string,
    password: string,
    library: string,
    country: string,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUserToProfile = (user: User | null): UserProfile | null => {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};
  const library = typeof metadata.library === "string" ? metadata.library : "";
  const country = typeof metadata.country === "string" ? metadata.country : "";
  const email = user.email ?? "";

  return {
    uid: user.id,
    email,
    library,
    country,
    isProfileComplete: Boolean(email && library && country),
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at ?? user.created_at),
  };
};

const getSupabaseClient = () => {
  if (!supabase || !hasSupabaseEnv) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return supabase;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !hasSupabaseEnv) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Failed to initialize auth session:", error);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      setUserProfile(mapUserToProfile(data.session?.user ?? null));
      setLoading(false);
    };

    init().catch((error) => {
      console.error("Unexpected auth initialization error:", error);
      if (isActive) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) {
        return;
      }

      setUserProfile(mapUserToProfile(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }

    setUserProfile(null);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const client = getSupabaseClient();
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const updateUserProfile = async (
    data: Partial<Pick<UserProfile, "library" | "country">>,
  ) => {
    const client = getSupabaseClient();
    const {
      data: { user },
      error: getUserError,
    } = await client.auth.getUser();

    if (getUserError) {
      throw getUserError;
    }

    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const mergedMetadata = {
      ...(user.user_metadata ?? {}),
      ...data,
    };

    const { data: updated, error: updateError } = await client.auth.updateUser({
      data: mergedMetadata,
    });

    if (updateError) {
      throw updateError;
    }

    setUserProfile(mapUserToProfile(updated.user));
  };

  const createUserProfile = async (
    email: string,
    password: string,
    library: string,
    country: string,
  ) => {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          library,
          country,
        },
      },
    });

    if (error) {
      throw error;
    }

    setUserProfile(mapUserToProfile(data.user));

    return {
      needsEmailConfirmation: !data.session,
    };
  };

  const value: AuthContextType = {
    userProfile,
    loading,
    signOut,
    signInWithEmail,
    updateUserProfile,
    createUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

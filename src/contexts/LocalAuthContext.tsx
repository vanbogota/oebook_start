"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UserProfile = {
  uid: string;
  nickname: string;
  library: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  uid: string;
};

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInAnonymous: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeProfile: (nickname: string, library: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Симуляция проверки аутентификации при загрузке
    const initAuth = async () => {
      setLoading(true);
      
      // Проверяем localStorage на наличие сохраненного пользователя
      const savedUser = localStorage.getItem('oebook_user');
      const savedProfile = localStorage.getItem('oebook_profile');
      
      if (savedUser && savedProfile) {
        setUser(JSON.parse(savedUser));
        const profile = JSON.parse(savedProfile);
        setUserProfile({
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt),
        });
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const signInAnonymous = async () => {
    try {
      setLoading(true);
      
      // Создаем анонимного пользователя
      const newUser = {
        uid: 'demo-user-' + Date.now(),
      };
      
      setUser(newUser);
      localStorage.setItem('oebook_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('oebook_user');
      localStorage.removeItem('oebook_profile');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedProfile = {
        ...userProfile!,
        ...data,
        updatedAt: new Date(),
      };

      setUserProfile(updatedProfile);
      localStorage.setItem('oebook_profile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const completeProfile = async (nickname: string, library: string) => {
    if (!user) return;

    try {
      const profileData = {
        uid: user.uid,
        nickname,
        library,
        isProfileComplete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUserProfile(profileData);
      localStorage.setItem('oebook_profile', JSON.stringify(profileData));
    } catch (error) {
      console.error('Error completing profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signInAnonymous,
    signOut,
    updateUserProfile,
    completeProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
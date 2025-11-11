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

// type User = {
//   uid: string;
// };

type AuthContextType = {
  // user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  // signInAnonymous: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  createUserProfile: (nickname: string, library: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Устанавливаем флаг что компонент смонтирован (избегаем проблем с гидратацией)
    setMounted(true);
  }, []);

  useEffect(() => {
    // Инициализация только после монтирования на клиенте
    if (!mounted) return;

    const initAuth = () => {
      setLoading(true);

      try {
      // Проверяем localStorage на наличие сохраненного пользователя
        // const savedUser = localStorage.getItem('oebook_user');
        const savedProfile = localStorage.getItem('oebook_profile');

        if (savedProfile) {
          // setUser(JSON.parse(savedUser));
          const profile = JSON.parse(savedProfile);
          setUserProfile({
            ...profile,
            createdAt: new Date(profile.createdAt),
            updatedAt: new Date(profile.updatedAt),
          });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Очищаем поврежденные данные
        // localStorage.removeItem('oebook_user');
        localStorage.removeItem('oebook_profile');
      }

      setLoading(false);
    };

    initAuth();
  }, [mounted]);

  // const signInAnonymous = async () => {
  //   if (!mounted) return;

  //   try {
  //     setLoading(true);

  //     // Создаем анонимного пользователя с более стабильным ID
  //     const timestamp = Date.now();
  //     const randomSuffix = Math.floor(Math.random() * 1000);
  //     const newUser = {
  //       uid: `demo-user-${timestamp}-${randomSuffix}`,
  //     };

  //     setUser(newUser);
  //     localStorage.setItem('oebook_user', JSON.stringify(newUser));
  //   } catch (error) {
  //     console.error('Error signing in:', error);
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signOut = async () => {
    if (!mounted) return;

    try {
      // setUser(null);
      setUserProfile(null);
      // localStorage.removeItem('oebook_user');
      localStorage.removeItem('oebook_profile');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!mounted) return;

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

  const createUserProfile = async (nickname: string, library: string) => {
    if (!mounted) return;

    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const newUid = `demo-user-${timestamp}-${randomSuffix}`;

    try {
      const profileData = {
        uid: newUid,
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
    // user,
    userProfile,
    loading,
    // signInAnonymous,
    signOut,
    updateUserProfile,
    createUserProfile,
  };

  // Пока компонент не смонтирован, показываем загрузку
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        // user: null,
        userProfile: null,
        loading: true,
        // signInAnonymous: async () => { },
        signOut: async () => { },
        updateUserProfile: async () => { },
        createUserProfile: async () => { },
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

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
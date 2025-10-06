"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserProfile = {
  uid: string;
  nickname: string;
  library: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Загружаем профиль пользователя из Firestore
        await loadUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid,
          nickname: data.nickname || '',
          library: data.library || '',
          isProfileComplete: data.isProfileComplete || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signInAnonymous = async () => {
    try {
      setLoading(true);
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedData = {
        ...data,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'users', user.uid), updatedData);
      
      // Обновляем локальное состояние
      setUserProfile(prev => prev ? { ...prev, ...updatedData } : null);
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

      await setDoc(doc(db, 'users', user.uid), profileData);
      setUserProfile(profileData);
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
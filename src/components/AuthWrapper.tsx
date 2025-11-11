"use client";
import { useAuth } from '@/contexts/LocalAuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  // const { user, userProfile, loading, signInAnonymous } = useAuth();
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   if (loading) return;

    // Если пользователь не авторизован, авторизуем анонимно
  // if (!user) {
  //   // router.push('/');
  //   signInAnonymous().catch(console.error);
  //   return;
  // }

  //Если id пользователя есть в LocalStorage, но профиль не заполнен
  // if (user && (!userProfile || !userProfile.isProfileComplete)) {
  //   if (pathname !== '/signup') {
  //     router.push('/signup');
  //   }
  //   return;
  // }

    // Если профиль заполнен и пользователь на onboarding, перенаправляем на главную
  //   if (userProfile?.isProfileComplete && pathname === '/signup') {
  //     router.push('/book-search');
  //     return;
  //   }
  // }, [user, userProfile, loading, pathname, router, signInAnonymous]);

  // Показываем загрузку во время инициализации
  if (loading) {
    return (
      <main className="font-sans min-h-screen p-8 mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-black/70 dark:text-white/70">Loading...</p>
        </div>
      </main>
    );
  }

  // Если нет пользователя, показываем загрузку (пока идет анонимная авторизация)
  // if (!user) {
  //   return (
  //     <main className="font-sans min-h-screen p-8 mx-auto flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
  //         <p className="text-black/70 dark:text-white/70">Initializing...</p>
  //       </div>
  //     </main>
  //   );
  // }

  return <>{children}</>;
}
import { ReactNode } from 'react';
import { MainTabProvider } from '@/contexts/MainTabContext';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MainTabProvider>{children}</MainTabProvider>;
}
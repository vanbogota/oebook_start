import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/LocalAuthContext";
import AuthWrapper from "@/components/AuthWrapper";
import PWAInstaller from "@/components/PWAInstaller";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import HomeHeader from "@/components/HomeHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const locales = ["en", "fi"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#171717",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Open Europe Books",
  description: "Search and request European library books",
  keywords: ["books", "library", "european", "search", "reading", "finna"],
  authors: [{ name: "Open Europe Books Team" }],
  creator: "Open Europe Books",
  publisher: "Open Europe Books",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Open Europe Books",
  },
  applicationName: "Open Europe Books",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.svg", sizes: "72x72", type: "image/svg+xml" },
      {
        url: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Open Europe Books",
    title: "Open Europe Books",
    description: "Search and request European library books",
    images: [
      {
        url: "/icons/icon-512x512.svg",
        width: 512,
        height: 512,
        alt: "Open Europe Books Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Open Europe Books",
    description: "Search and request European library books",
    images: ["/icons/icon-512x512.svg"],
  },
};

export default async function LocalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              {/* <AuthWrapper> */}
              <HomeHeader />
              <>{children}</>

              {/* </AuthWrapper> */}
            </AuthProvider>
          </TooltipProvider>
          <PWAInstaller />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

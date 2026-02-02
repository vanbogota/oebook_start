"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

const LAST_PATH_KEY = "lastPathNoLocale";

export const useNavigation = () => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    router.prefetch(`/${locale}/main`);
    router.prefetch(`/${locale}/profile`);
    router.prefetch(`/${locale}`);
  }, [locale, router]);

  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const currentNoLocalePath = `${pathname.replace(/^\/[^/]+/, "")}${search}`;
    const previousNoLocalePath = previousPathRef.current;
    if (previousNoLocalePath && previousNoLocalePath !== currentNoLocalePath) {
      sessionStorage.setItem(LAST_PATH_KEY, previousNoLocalePath);
    }
    previousPathRef.current = currentNoLocalePath;
  }, [pathname]);

  const navigateToMain = () => {
    router.push(`/${locale}/main`);
  };

  const navigateToProfile = () => {
    router.push(`/${locale}/profile`);
  };

  const navigateToHome = () => {
    router.push(`/${locale}`);
  };

  const navigateToSignup = () => {
    router.push(`/${locale}/signup`);
  };

  const navigateToScan = (params?: string) => {
    const url = params ? `/${locale}/scan-request?${params}` : `/${locale}/scan-request`;
    router.push(url);
  };

  const navigateBack = () => {
    const lastPath = sessionStorage.getItem(LAST_PATH_KEY);
    router.push(lastPath ? `/${locale}${lastPath}` : `/${locale}`);
  };

  return {
    navigateToMain,
    navigateToProfile,
    navigateToHome,
    navigateToScan,
    navigateToSignup,
    navigateBack,
    router,
    locale,
  };
};

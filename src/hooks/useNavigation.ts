"use client";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const LAST_PATH_KEY = "lastPath";

export const useNavigation = () => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const saveCurrentPath = () => {
    if (typeof window === "undefined") return;
    if (pathname) {
      sessionStorage.setItem(LAST_PATH_KEY, pathname);
    }
  };

  const navigateToMain = () => {
    router.push(`/main`);
  };

  const navigateToProfile = () => {
    router.push(`/profile`);
  };

  const navigateToHome = () => {
    router.push(`/`);
  };

  const navigateToSignup = () => {
    saveCurrentPath();
    router.push(`/signup`);
  };

  const navigateToScan = (params?: string) => {
    const url = params ? `/scan-request?${params}` : `/scan-request`;
    router.push(url);
  };

  const navigateFromSignUp = () => {
    if (typeof window === "undefined") {
      router.push(`/`);
      return;
    }
    const lastPath = sessionStorage.getItem(LAST_PATH_KEY);
    router.push(lastPath || `/`);
    sessionStorage.setItem(LAST_PATH_KEY, "");
  };

  return {
    navigateToMain,
    navigateToProfile,
    navigateToHome,
    navigateToScan,
    navigateToSignup,
    navigateFromSignUp,
    router,
    locale,
  };
};

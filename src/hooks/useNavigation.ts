import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export const useNavigation = () => {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.prefetch(`/${locale}/main`);
    router.prefetch(`/${locale}/profile`);
    router.prefetch(`/${locale}`);
  }, [locale, router]);

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

  return {
    navigateToMain,
    navigateToProfile,
    navigateToHome,
    navigateToScan,
    navigateToSignup,
    router,
    locale,
  };
};

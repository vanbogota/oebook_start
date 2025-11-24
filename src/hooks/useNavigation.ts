import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export const useNavigation = () => {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.prefetch(`/${locale}/book-search`);
    router.prefetch(`/${locale}/profile`);
    router.prefetch(`/${locale}`);
  }, [locale, router]);

  const navigateToSearch = () => {
    router.push(`/${locale}/book-search`);
  };

  const navigateToProfile = () => {
    router.push(`/${locale}/profile`);
  };

  const navigateToHome = () => {
    router.push(`/${locale}`);
  };

  const navigateToScan = (params?: string) => {
    const url = params ? `/${locale}/scan?${params}` : `/${locale}/scan`;
    router.push(url);
  };

  return {
    navigateToSearch,
    navigateToProfile,
    navigateToHome,
    navigateToScan,
    router,
    locale,
  };
};

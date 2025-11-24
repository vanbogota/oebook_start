import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export const useNavigation = () => {
  const router = useRouter();
  const locale = useLocale();

  const navigateToSearch = () => {
    router.push(`/${locale}/book-search`);
  };

  const navigateToProfile = () => {
    router.push(`/${locale}/profile`);
  };

  const navigateToHome = () => {
    router.push(`/${locale}`);
  };

  const navigateToScan = (params: string) => {
	router.push(`/${locale}/scan-request?${params}`);
  }

  return {
    navigateToSearch,
    navigateToProfile,
    navigateToHome,
	  navigateToScan,
    router,
    locale,
  };
};
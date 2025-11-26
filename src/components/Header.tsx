"use client";
import {
  Search as SearchIcon,
  BookOpen,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Button } from "@/components/common/button";
import { Avatar, AvatarFallback } from "@/components/common/avatar";
import { useAuth } from "@/contexts/LocalAuthContext";
import { usePWA } from "./PWAInstaller";
import LanguageSwitcher from "./LanguageSwitcher";
import { useNavigation } from "@/hooks/useNavigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export const Header: React.FC = () => {
  const { installApp, isInstallable, isStandalone } = usePWA();
  const { userProfile, signOut } = useAuth();
  const { navigateToHome } = useNavigation();
  const t = useTranslations("UserDropdown");
  const locale = useLocale();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigateToHome();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="w-full border-b bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
        <Link
          href={`/${locale}/main`}
          className="flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">How It Works</h2>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-background"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("myAccount")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userProfile?.nickname || "User"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <Link href={`/${locale}/profile`}>{t("profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="link" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logOut")}</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

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
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { User, Settings, LogOut, Info, Mail, MailQuestion } from "lucide-react";
import { useAuth } from "@/contexts/LocalAuthContext";
import { useNavigation } from "@/hooks/useNavigation";

const MenuUser = () => {
  const { userProfile, signOut } = useAuth();
  const { navigateToHome } = useNavigation();
  const t = useTranslations("Menu");
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
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
            <p className="text-sm font-medium leading-none mb-2">
              {t("myAccount")}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile?.nickname || "User"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MailQuestion className="mr-2 h-4 w-4" />
          <Link href="">{t("incoming-requests")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <Link href="">{t("my-requests")}</Link>
        </DropdownMenuItem>

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
          <Info className="mr-2 h-4 w-4" />
          <span>{t("instructions")}</span>
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
  );
};

export default MenuUser;

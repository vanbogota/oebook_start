import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Button } from "@/components/common/button";
import { Avatar, AvatarFallback } from "@/components/common/avatar";
import { useTranslations } from "next-intl";
import { User, LogIn, Info } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

const MenuGuest = () => {
  const { navigateToSignup } = useNavigation();
  const t = useTranslations("Menu");
  const handleSignIn = async () => {
    navigateToSignup();
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
        <DropdownMenuItem>
            <Info className="mr-2 h-4 w-4" />
            <span>{t("instructions")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button variant="link" onClick={handleSignIn}>
            <LogIn className="mr-2 h-4 w-4" />
            <span>{t("logIn")}</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuGuest;

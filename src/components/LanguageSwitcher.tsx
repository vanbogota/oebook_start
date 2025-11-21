"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const locales = [
  { code: "en", name: "English" },
  { code: "fi", name: "Suomi" },
] as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    router.replace(`/${newLocale}${pathname.substring(3)}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute z-50 right-5 top-5 flex items-center gap-2 min-w-[4.5rem] justify-between focus:outline-none focus-visible:none hover:bg-background"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="flex items-center gap-1">
              <span>{locale.toUpperCase()}</span>
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[4.5rem] gap-1">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => switchLanguage(loc.code)}
            className={`flex items-center gap-2 cursor-pointer transition-colors hover:bg-primary data-[highlighted]:bg-primary/80 data-[highlighted]:text-primary-foreground hover:text-primary-foreground  ${
              loc.code === locale ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <span>{loc.code.toUpperCase()}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

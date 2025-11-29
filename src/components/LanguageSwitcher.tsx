"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Globe, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Button } from "@/components/common/button";

const locales = [
  { code: "en", name: "English" },
  { code: "fi", name: "Suomi" },
] as const;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const switchLanguage = (newLocale: string) => {
    if (isLoading || newLocale === locale) return;

    setIsLoading(true);

    // Get current search params at the moment of switching
    const currentSearchParams =
      typeof window !== "undefined" ? window.location.search : "";

    // Preserve all search parameters when switching language
    const newPathname = pathname.replace(/^\/[^/]+/, "");

    const newUrl = `/${newLocale}${newPathname}${currentSearchParams}`;

    router.push(newUrl);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 min-w-[2rem] border rounded-full justify-between focus:outline-none focus-visible:none hover:bg-background"
        >
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span>{locale.toUpperCase()}</span>
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

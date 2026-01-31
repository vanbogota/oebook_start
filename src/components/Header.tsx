"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale } from "next-intl";
import Link from "next/link";
import Menu from "./Menu";

export const Header: React.FC = () => {
  const locale = useLocale();

  return (
    <header className="w-full border-b bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
        <Link
          href={`/${locale}/`}
          className="flex items-center gap-2 cursor-pointer"
        >
          {/* <BookOpen className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold">{t("title")}</h2> */}
          <img className="h-5" src="/logo.png" alt="Open Europe Book Logo"/>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Menu />
        </div>
      </div>
    </header>
  );
};

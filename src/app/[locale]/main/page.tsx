"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs";
import { Header } from "@/components/Header";
import PrintRequestForm from "@/components/PrintRequestForm";
import BookSearch from "@/components/BookSearch";
import { Printer, Search as SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MainPage() {
  const t = useTranslations("MainPage");
  const [activeTab, setActiveTab] = useState<string>("print");

  useEffect(() => {
    const savedTab = sessionStorage.getItem("activeTab");

    if (savedTab === "search") {
      setActiveTab("search");
    } else {
      setActiveTab("print");
    }
  }, []);

  // Save active tab to session storage
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    sessionStorage.setItem("activeTab", value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="print" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              {t("print-book-button")}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <SearchIcon className="w-4 h-4" />
              {t("search-button")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <BookSearch />
          </TabsContent>
          <TabsContent value="print">
            <PrintRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
import WaitingListForm from "@/components/WaitingListForm";

export default function MainPage() {
  const t = useTranslations("MainPage");
  const [activeTab, setActiveTab] = useState<string>("waiting");

  useEffect(() => {
    const savedTab = sessionStorage.getItem("activeTab");

    if (savedTab === "search") {
      setActiveTab("search");
    } else if (savedTab === "waiting") {
      setActiveTab("waiting");
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
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="waiting" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Join Waiting List
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <SearchIcon className="w-4 h-4" />
              {t("search-button")}
            </TabsTrigger>
            <TabsTrigger value="print" className="flex items-center gap-2">
              <SearchIcon className="w-4 h-4" />
              Order Paper Book
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waiting">
            <WaitingListForm />
            {/* <PrintRequestForm /> */}
          </TabsContent>
          <TabsContent value="search">
            <BookSearch />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

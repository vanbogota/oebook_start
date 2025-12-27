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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
          </TabsContent>
          <TabsContent value="search">
            <BookSearch />
          </TabsContent>
          <TabsContent value="print">
             <div className="text-center">{t.rich("page-under-construction", {
               important: (chunks) => <b className="underline" onClick={() => handleTabChange("waiting")}>{chunks}</b>,
             })}</div>
            {/* <PrintRequestForm /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

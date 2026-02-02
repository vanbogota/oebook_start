"use client";

import { useState, useEffect, useContext } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs";
import { Header } from "@/components/Header";
import PrintRequestForm from "@/components/PrintRequestForm";
import BookSearch from "@/components/BookSearch";
import { PrinterIcon, Search as SearchIcon, ListIcon,  ScanIcon, BookOpenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import WaitingListForm from "@/components/WaitingListForm";
import { TabContext, TabType } from "@/contexts/MainTabContext";
import PrintBookPage from "../print-book/page";
import ReadBookPage from "../read-book/page";
import ScanBookPage from "../scan-book/page";

export default function MainPage() {
  const t = useTranslations("MainPage");
 const { activeTab, changeTab } = useContext(TabContext);

  const handleTabChange = (value: TabType) => {
    changeTab(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <div className="container mx-auto px-2 md:px-10 lg:px-40 py-12 max-w-[6xl]">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5 mb-8">
            <TabsTrigger value="waiting" className="flex items-center gap-2">
              <ListIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("waiting-list")}</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <SearchIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("search-book")}</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <ScanIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("scan-book")}</span>
            </TabsTrigger>
            <TabsTrigger value="read" className="flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4" />
              <span className="hidden md:inline">{t("read-book")}</span>
            </TabsTrigger>
            <TabsTrigger value="print" className="flex items-center gap-2">
              <PrinterIcon className="w-4 h-4" />
             <span className="hidden md:inline">{t("print-book")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="waiting">
            <WaitingListForm />
          </TabsContent>
          <TabsContent value="search">
            <BookSearch />
          </TabsContent>
          <TabsContent value="scan">
            <ScanBookPage />
          </TabsContent>
          <TabsContent value="read">
            <ReadBookPage />
          </TabsContent>
          <TabsContent value="print">
             <PrintBookPage />
            {/* <PrintRequestForm /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

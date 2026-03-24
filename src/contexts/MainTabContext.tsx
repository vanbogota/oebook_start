"use client";
import { createContext, useState } from "react";

export type TabType = "waiting" | "search" | "scan" | "read" | "print";
type TabContextType = {
  activeTab: TabType;
  changeTab: (tab: TabType) => void;
};

const TabContext = createContext<TabContextType>({
  activeTab: "waiting",
  changeTab: () => {}
});

const MainTabProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabType>("waiting");

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
  };
  return (
    <TabContext.Provider value={{ activeTab, changeTab }}>
      {children}
    </TabContext.Provider>
  );
};

export { TabContext, MainTabProvider };
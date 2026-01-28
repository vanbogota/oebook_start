"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { TabContext, TabType } from "@/contexts/MainTabContext";
import { useTranslations } from "next-intl";
import { useContext } from "react";

const PrintBookPage = () => {
  const t = useTranslations("PrintRequest");
  const { changeTab } = useContext(TabContext);

  const handleClick = (value: TabType) => {
    changeTab(value);
  };

  return (
    <Card className="mb-12 shadow-lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 max-[450px]:flex-col max-[450px]:gap-2">
          <div className="text-center">
            {t.rich("page-under-construction", {
              important: (chunks) => (
                <b className="underline" onClick={() => handleClick("waiting")}>
                  {chunks}
                </b>
              ),
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintBookPage;

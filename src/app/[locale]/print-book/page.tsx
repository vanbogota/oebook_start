"use client";

import { Button } from "@/components/common/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { useAuth } from "@/contexts/LocalAuthContext";
import { TabContext, TabType } from "@/contexts/MainTabContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";
import { useContext } from "react";

const PrintBookPage = () => {
  const { userProfile } = useAuth();
  const t = useTranslations("PrintRequest");
  const { navigateToSignup } = useNavigation();
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
         <div className="flex gap-4 flex-col w-[60rem] max-w-full mx-auto">
          {/* for registered users for now */}
          {userProfile ? (
            <div className="text-left">
              {t.rich("page-under-construction", {
                important: (chunks) => (
                  <b
                    className="underline cursor-pointer"
                    onClick={() => handleClick("waiting")}
                  >
                    {chunks}
                  </b>
                ),
              })}
            </div>
          ) : (
            <div>
              <p className="mb-8">{t("register")}</p>
              <Button
                size="lg"
                className="text-lg md:px-12 md:py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigateToSignup()}
              >
                {t("register-btn")}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintBookPage;

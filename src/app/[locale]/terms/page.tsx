"use client";
import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/common/card";
import { Button } from "@/components/common/button";
import { useNavigation } from "@/hooks/useNavigation";

const TermsPage = () => {
  const t = useTranslations("Terms");
  const { navigateToSignup } = useNavigation();

  return (
    <main className="min-h-screen flex items-center justify-center p-8 w-full bg-gradient-to-br from-background via-secondary/30 to-background">
      <Button
        className="absolute font-bold left-[1rem] top-[1rem]"
        variant="link"
        onClick={() => navigateToSignup()}
      >
        ← {t("back")}
      </Button>
      <Card className="w-full shadow-xl max-w-4xl border-0 mt-10 h-[80vh]">
        <CardHeader className="space-y-4 text-center pb-8">
          <CardTitle className="text-2xl text-left">{t("title")}</CardTitle>
          <CardDescription className="text-base mt-2 max-w-2xl  mx-auto"></CardDescription>
        </CardHeader>

        <CardContent className="space-y-8"></CardContent>
      </Card>
    </main>
  );
};
export default TermsPage;

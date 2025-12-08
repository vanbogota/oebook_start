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
        </CardHeader>

        <CardContent className="space-y-8">
          <section className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">{t("section1Title")}</h2>
            <p>{t("section1Body")}</p>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section2Title")}
            </h2>
            <p>{t("section2Body")}</p>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section3Title")}
            </h2>
            <p>{t("section3Body")}</p>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section4Title")}
            </h2>
            <p>{t("section4Body")}</p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
};
export default TermsPage;

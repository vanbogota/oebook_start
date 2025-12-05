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
            <h2 className="text-xl font-semibold mb-4">{t("section1Title", { default: "1. Introduction" })}</h2>
            <p>
              {t(
                "section1Body",
                {
                  default:
                    "Welcome to our service. By using this application, you agree to the following terms and conditions. Please read them carefully before proceeding."
                }
              )}
            </p>
            <h2 className="text-xl font-semibold mt-8 mb-4">{t("section2Title", { default: "2. Use of Service" })}</h2>
            <p>
              {t(
                "section2Body",
                {
                  default:
                    "You may use this application to search for books in European libraries via the Finna API. You agree not to misuse the service or attempt to access data you are not authorized to view."
                }
              )}
            </p>
            <h2 className="text-xl font-semibold mt-8 mb-4">{t("section3Title", { default: "3. Limitation of Liability" })}</h2>
            <p>
              {t(
                "section3Body",
                {
                  default:
                    "We provide this service as-is and make no guarantees regarding its availability or accuracy. We are not responsible for any damages resulting from the use of this application."
                }
              )}
            </p>
            <h2 className="text-xl font-semibold mt-8 mb-4">{t("section4Title", { default: "4. Changes to Terms" })}</h2>
            <p>
              {t(
                "section4Body",
                {
                  default:
                    "We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of the new terms."
                }
              )}
            </p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
};
export default TermsPage;

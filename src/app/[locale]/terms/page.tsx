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
      <Card className="w-full shadow-xl max-w-4xl border-0 mt-10 h-auto">
        <CardHeader className="space-y-4 text-center pb-8">
          <CardTitle className="text-2xl text-left">{t("title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <section className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">
              {t("section1.title")}
            </h2>
            <p>
              {t.rich("section1.1", {
                guidelines: (chunks) => <span><br/>{chunks}<br/></span>,
              })}
            </p>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section2.title")}
            </h2>
            <p>
              {t.rich("section2.1", {
                guidelines: (chunks) => <span><br/>{chunks}</span>,
              })}
            </p>
            <ul className="list-disc list-inside mb-2">
              <li>{t("section2.1-1")}</li>
              <li>{t("section2.1-2")}</li>
              <li>{t("section2.1-3")}</li>
            </ul>
            <p>{t("section2.2")}</p>
            <p>{t("section2.2-1")}</p>
            <ul className="list-disc list-inside">
              <li>{t("section2.2-2")}</li>
              <li>{t("section2.2-3")}</li>
              <li>{t("section2.2-4")}</li>
              <li>{t("section2.2-5")}</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section3.title")}
            </h2>
            <p>{t("section3.1")}</p>
            <ul className="list-disc list-inside">
              <li>{t("section3.2")}</li>
              <li>{t("section3.3")}</li>
              <li>{t("section3.4")}</li>
            </ul>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section4.title")}
            </h2>
            <p>{t("section4.1")}</p>
            <p className="mb-2">{t("section4.1-1")}</p>
            <p>{t("section4.2")}</p>
            <p className="mb-2">{t("section4.2-1")}</p>
            <p>{t("section4.3")}</p>
            <p>{t("section4.3-1")}</p>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section5.title")}
            </h2>
            <p>{t("section5.1")}</p>
            <p className="mb-2">{t("section5.1-1")}</p>
            <p>{t("section5.2")}</p>
            <p>{t("section5.2-1")}</p>
            <p>{t("section5.2-2")}</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section6.title")}
            </h2>
            <p>{t("section6.1")}</p>
            <p className="mb-2">{t("section6.1-1")}</p>
            <p>{t("section6.2")}</p>
            <p>{t("section6.2-1")}</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section7.title")}
            </h2>
            <p>{t("section7.1")}</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section8.title")}
            </h2>
            <p>{t("section8.1")}</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section9.title")}
            </h2>
            <p>{t("section9.1")}</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              {t("section10.title")}
            </h2>
            <p>{t("section10.1")}</p>
            <p>{t.rich("section10.2", {
              guidelines: (chunks) => <span className="font-semibold">{chunks}</span>,
            })}</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">{t("contacts")}</h2>
            <h3 className="text-lg font-semibold mb-2 uppercase">
              Smart Paper
            </h3>
            <p>{t("address1")}</p>
            <p>{t("address2")}</p>
            <p className="my-2">{t("contact-person")}</p>
            <p>{t("company")}</p>
            <p>{t("company-id")}</p>
            <a className="my-4 block underline" href="https://smartpaper.fi/en/contacts-and-legal-info/">
              https://smartpaper.fi/en/contacts-and-legal-info/
            </a>
            <p>{t("final-note")}</p>
            <p>{t("final-note-body")}</p>
            <p className="my-4">{t("copyright")}</p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
};
export default TermsPage;

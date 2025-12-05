"use client";
import { useTranslations } from "next-intl";
import { COUNTRIES } from "@/data/countries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { Globe } from "lucide-react";
import { Button } from "@/components/common/button";
import { useNavigation } from "@/hooks/useNavigation";

const CountriesPage = () => {
  const t = useTranslations("Countries");
  const { navigateToSignup } = useNavigation();

  return (
    <main className="min-h-screen flex items-center justify-center p-8 w-full bg-gradient-to-br from-background via-secondary/30 to-background">
	  <Button className="absolute font-bold left-[1rem] top-[1rem]" variant="link" onClick={()=>navigateToSignup()}> ← {t("back")}</Button>
      <Card className="w-full shadow-xl max-w-4xl border-0 mt-10">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <Globe className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription className="text-base mt-2 max-w-2xl  mx-auto">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Countries with Both Systems */}
          <section>
            <div className="flex items-center gap-3 mb-4">
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {COUNTRIES.map((country) => (
                <div
                  key={country}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary/50 to-secondary/20 hover:from-secondary/70 hover:to-secondary/30 transition-all border border-border/50"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{country}</span>
                </div>
              ))}
            </div>
          </section>

        </CardContent>
      </Card>
    </main>
  );
};

export default CountriesPage;
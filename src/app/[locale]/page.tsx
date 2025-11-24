"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/LocalAuthContext";
import { BookOpen, Search, Scan, BookOpenText } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Home() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const t = useTranslations("Home");

  useEffect(() => {
    // Если профиль заполнен и пользователь на onboarding, перенаправляем на главную
    if (userProfile?.isProfileComplete) {
      router.push("/book-search");
      return;
    }
  }, [userProfile, router]);

  const features = [
    {
      icon: Search,
      title: t("search-title"),
      description: t("search-description"),
    },
    {
      icon: Scan,
      title: t("scan-title"),
      description: t("scan-description"),
    },
    {
      icon: BookOpenText,
      title: t("print-title"),
      description: t("print-description"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/library-hero.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-2xl mb-4">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {t("hero-title")}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto bg-background/70 p-2 border rounded-lg text-color-foreground leading-relaxed">
            {t("hero-subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push("/signup")}
            >
              {t("get-started")}
            </Button>
            <a href="#learn-more">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-card/80 backdrop-blur-sm hover:bg-card transition-all"
              >
                {t("learn-more")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-4 bg-gradient-to-b from-background to-secondary/30"
        id="learn-more"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t("how-it-works")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("join-community")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-card to-secondary/30">
            <CardHeader className="space-y-4 pb-8">
              <CardTitle className="text-4xl md:text-5xl">
                {t("ready-to-start")}
              </CardTitle>
              <CardDescription className="text-lg">
                {t("join-thousands")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-10">
              <Button
                size="lg"
                className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push("/signup")}
              >
                {t("create-account")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

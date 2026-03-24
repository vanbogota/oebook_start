"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Checkbox } from "@/components/common/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/LocalAuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import COUNTRIES from "@/data/countries";
import LIBRARIES from "@/data/libraries";

export const SignupForm = () => {
  const { createUserProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCountries, setAcceptedCountries] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const libraries = LIBRARIES;
  const loadingLibraries = false;
  const { toast } = useToast();
  const t = useTranslations("SignUp");
  const { navigateToMain, navigateFromSignUp, navigateToRestore, locale } =
    useNavigation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!selectedLibrary) {
      setError(t("library-required"));
      return;
    }

    if (!acceptedTerms) {
      setError(t("terms-required"));
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const result = await createUserProfile(
        email.trim(),
        password,
        selectedLibrary,
        selectedCountry,
      );

      if (result.needsEmailConfirmation) {
        setInfoMessage(
          "Account created. Please confirm your email, then sign in.",
        );
        return;
      }

      toast({
        title: "Success",
        description: "Successfully created your account.",
      });

      navigateToMain();
    } catch (submitError) {
      console.error("Error creating profile:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCountries = (checked: boolean) => {
    if (selectedCountry === "") {
      setAcceptedCountries(false);
      setError(t("select-country-error"));
      return;
    }

    setAcceptedCountries(checked);
    setError(null);
  };

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="w-full max-w-full mx-auto mb-2">
        <button
          onClick={() => navigateFromSignUp()}
          className="text-left text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white my-2 font-bold"
        >
          {"<-"} {t("back")}
        </button>
      </div>

      <Card className="w-full max-w-md shadow-xl mt-2">
        <CardHeader className="text-center space-y-4">
          <div className="hero-icon-gradient mx-auto inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-2xl">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl">
              {t("title")} OpenEuropeBooks
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t("description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                  setInfoMessage(null);
                }}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                  setInfoMessage(null);
                }}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="library">{t("library-label")}</Label>
              <Select
                value={selectedLibrary}
                onValueChange={setSelectedLibrary}
                required
                disabled={loadingLibraries}
              >
                <SelectTrigger
                  id="library"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                >
                  <SelectValue
                    placeholder={
                      loadingLibraries
                        ? "Loading libraries..."
                        : t("library-placeholder")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {libraries.map((library) => (
                    <SelectItem key={library.id} value={library.id}>
                      {library.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="countries"
                checked={acceptedCountries}
                onCheckedChange={(checked) =>
                  handleAcceptCountries(checked as boolean)
                }
                className="mt-1"
              />
              <Label
                htmlFor="countries"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer flex flex-col"
              >
                <span className="inline w-auto">
                  {t("terms-label1-1")}
                  <Select
                    value={selectedCountry}
                    onValueChange={handleSelectCountry}
                    required
                  >
                    <SelectTrigger
                      id="country"
                      className="transition-all focus:none border-hidden py-0 underline h-6 w-auto inline-flex align-baseline focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 gap-2"
                    >
                      <SelectValue placeholder={t("country-placeholder")} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {t(`Countries.${country}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {t("terms-label1-2")}
                </span>
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
                className="mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer flex flex-col"
              >
                <span>
                  {t.rich("terms-label2", {
                    guidelines: (chunks) => (
                      <Link className="underline" href={`/${locale}/terms`}>
                        {chunks}
                      </Link>
                    ),
                  })}{" "}
                </span>
              </Label>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}

            {infoMessage && (
              <div className="text-green-600 dark:text-green-400 text-sm">{infoMessage}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                loading ||
                !acceptedTerms ||
                !acceptedCountries ||
                !email.trim() ||
                !password.trim() ||
                !selectedLibrary
              }
            >
              {loading ? "Creating..." : t("create-account")}
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Already have an account?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={navigateToRestore}
                className="text-primary"
              >
                Sign in with email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

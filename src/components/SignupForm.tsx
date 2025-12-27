'use client'
import { useState, useEffect } from "react";
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
import { useTranslations } from "use-intl";
import Link from "next/link";
import COUNTRIES from "@/data/countries";
import LIBRARIES from "@/data/libraries";
import type { Library } from "@/types/interfaces";

export const SignupForm = () => {
  const { createUserProfile } = useAuth();
  const [nickname, setNickname] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCountries, setAcceptedCountries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraries, setLibraries] = useState<Library[]>(LIBRARIES);
  const [loadingLibraries, setLoadingLibraries] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("SignUp");
  const { navigateToMain, router, locale } = useNavigation();

  // useEffect(() => {
  //   const fetchLibraries = async () => {
  //     try {
  //       const response = await fetch('/api/libraries');
  //       if (!response.ok) throw new Error('Failed to fetch libraries');
  //       const data = await response.json();

  //       // Filter only libraries (sector === 'library') and sort by name
  //       const libraryList = data.libraries
  //         .filter((lib: { sector: string | null }) => lib.sector === 'library')
  //         .map((lib: { id: string; name: string; city: string | null; sector: string | null }) => ({
  //           id: lib.id,
  //           name: lib.name,
  //           city: lib.city,
  //           sector: lib.sector,
  //         }))
  //         .sort((a: Library, b: Library) => a.name.localeCompare(b.name));

  //       setLibraries(libraryList);
  //     } catch (error) {
  //       console.error('Error fetching libraries:', error);
  //       toast({
  //         title: "Error loading libraries",
  //         description: "Please refresh the page.",
  //         variant: "destructive"
  //       });
  //     } finally {
  //       setLoadingLibraries(false);
  //     }
  //   };

  //   fetchLibraries();
  // }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError(t("nickname-required"));
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

    setError(null);

    try {
      await createUserProfile(
        nickname.trim(),
        selectedLibrary,
        selectedCountry
      );

      toast({
        title: "Success",
        description: "Successfully created your profile.",
      });

      navigateToMain();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error while creating profile",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAcceptCountries = (checked: boolean) => {
    if (selectedCountry === "") {
      setAcceptedCountries(false);
      setError(t("select-country-error"));
      return;
    } else {
      setAcceptedCountries(checked);
    }
  };

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">
              {t("title")} OpenEuropeBooks™
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t("description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">{t("nickname-label")}</Label>
              <Input
                id="nickname"
                type="text"
                placeholder={t("nickname-placeholder")}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

              <div className="space-y-2">
                <Label htmlFor="library">{t("library-label")}</Label>
              <Select value={selectedLibrary} onValueChange={setSelectedLibrary} required disabled={loadingLibraries}>
                  <SelectTrigger id="library" className="transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder={loadingLibraries ? "Loading libraries..." : t("library-placeholder")} />
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
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={
                !acceptedTerms ||
                !acceptedCountries ||
                !nickname.trim() ||
                !selectedLibrary
              }
            >
              {t("create-account")}
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Already have an account?
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/restore")}
                className="text-primary"
              >
                Restore from Recovery Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

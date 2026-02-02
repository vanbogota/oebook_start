"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/LocalAuthContext";
import {
  clearSearchCache,
  hasSavedResults,
  type SearchResult as BookDetails,
} from "@/utils/searchCache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./common/card";
import { Button } from "./common/button";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";

export function ScanRequestContent() {
  const { navigateToMain, navigateToProfile } = useNavigation();
  const searchParams = useSearchParams();
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("ScanRequest");

  useEffect(() => {
    const wasSubmitted = sessionStorage.getItem("scanRequestSubmitted");
    if (wasSubmitted === "true") {
      setSubmitted(true);
      return;
    }
  }, []);

  // Извлекаем данные книги из URL параметров
  const bookData: BookDetails = {
    id: searchParams.get("id") || "",
    title: searchParams.get("title") || "",
    authors: searchParams.get("authors")?.split(",") || [],
    year: searchParams.get("year") ? parseInt(searchParams.get("year")!) : null,
    library: searchParams.get("library"),
    isbn: searchParams.get("isbn"),
    imageId: null, // URL параметры не содержат imageId
  };

  const handleBackToSearch = () => {
    // Clear submission state when navigating back
    sessionStorage.removeItem("scanRequestSubmitted");
    navigateToMain();
  };
  const handleToProfile = () => {
    // Clear submission state when navigating back
    sessionStorage.removeItem("scanRequestSubmitted");
    navigateToProfile();
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      // Здесь будет логика отправки запроса на сервер
      // Пока что имитируем отправку
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Scan request submitted:", {
        book: bookData,
        // user: userProfile?.nickname,
        timestamp: new Date().toISOString(),
      });

      clearSearchCache();
      // Mark as submitted in sessionStorage to persist across language changes
      sessionStorage.setItem("scanRequestSubmitted", "true");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting scan request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="font-sans min-h-screen p-8 mx-auto max-w-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">{t("title")}</h1>
            <p className="text-black/70 dark:text-white/70">
              {t("confirmation-message")}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleBackToSearch()}
              className="px-4 py-2 bg-black/5 dark:bg-white/10 rounded-md hover:bg-black/10 dark:hover:bg-white/20"
            >
              {t("back-to-search")}
            </button>
            <button
              onClick={() => handleToProfile()}
              className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90"
            >
              {t("view-profile")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!bookData.title) {
    return (
      <main className="font-sans min-h-screen p-8 mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            {t("no-book-selected")}
          </h1>
          <p className="text-black/70 dark:text-white/70 mb-6">
            {t("no-book-info")}
          </p>
          <button
            onClick={() => handleBackToSearch()}
            className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90"
          >
            {t("back-to-search")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="w-full max-w">
        <button
          onClick={() => handleBackToSearch()}
          className="text-left text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white mb-4 font-bold"
        >
          ← {t("back")}
        </button>
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl">
            {t("confirm-scan-request")}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {t("confirm-details")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/5 dark:bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">{t("book-details")}</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                  {t("book-title")}
                </label>
                <p className="text-base">{bookData.title}</p>
              </div>

              {bookData.authors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                    {t("book-authors")}
                  </label>
                  <p className="text-base">{bookData.authors.join(", ")}</p>
                </div>
              )}

              {bookData.year && (
                <div>
                  <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                    {t("year")}
                  </label>
                  <p className="text-base">{bookData.year}</p>
                </div>
              )}

              {bookData.isbn && (
                <div>
                  <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                    {t("book-isbn")}
                  </label>
                  <p className="text-base">{bookData.isbn}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium mb-2">{t("request-info")}</h3>
            <p className="text-sm text-black/70 dark:text-white/70">
              {/* Requested by: <strong>{userProfile?.nickname}</strong><br /> */}
              {t("request-date")}:{" "}
              <strong>{new Date().toLocaleDateString()}</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleBackToSearch()}
              className="flex-1 text-lg px-8 py-6 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all"
              disabled={isSubmitting}
              size="lg"
              variant="outline"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSubmitRequest}
              className="flex-1 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all border"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? t("submitting") : t("confirm-request")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

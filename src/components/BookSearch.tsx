"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { Label } from "@/components/common/label";
import { Search as SearchIcon, BookOpen, BrushCleaning } from "lucide-react";
import { SearchResult } from "@/utils/searchCache";
import { useSearchCache } from "@/hooks/useSearchCache";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/LocalAuthContext";

const BookSearch = () => {
  const { userProfile } = useAuth();

  const { navigateToScan, navigateToSignup } = useNavigation();
  const { query, results, updateSearchResults, clearSearch, setQueryOnly } =
    useSearchCache();

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Search");

  async function handleSearch() {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");

      const searchResults = data.results || [];
      updateSearchResults(query, searchResults);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      clearSearch();
    } finally {
      setIsSearching(false);
    }
  }

  const handleRequestScan = (book: SearchResult) => {
    if (!userProfile) {
      navigateToSignup();
      return;
    }
    const params = new URLSearchParams({
      id: book.id,
      title: book.title,
      authors: book.authors.join(","),
      ...(book.year && { year: book.year.toString() }),
      ...(book.library && { library: book.library }),
      ...(book.isbn && { isbn: book.isbn }),
    });
    navigateToScan(params.toString());
  };

  return (
    <>
      <div
        className={`text-center transition-all duration-500 ease-out ${
          results.length > 0
            ? "opacity-0 max-h-0 overflow-hidden mb-0"
            : "opacity-100 max-h-96 mb-0"
        }`}
      >
        {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg mb-4">
		  <BookOpen className="w-8 h-8 text-primary-foreground" />
		</div> */}
        {/* <h1 className="text-4xl md:text-5xl font-bold mb-4">
		   {t("title")}
		</h1>
		<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
		  {t("sub-title")}
		</p> */}
      </div>
      {/* Search Bar */}
      <Card className="mb-12 shadow-lg">
        <CardHeader>
          <CardTitle>{t("card-title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
           {t("card-description")}
          </div>
          <div className="flex gap-4 max-[450px]:flex-col max-[450px]:gap-2">
            <Input
              name="text"
              placeholder="e.g., Principia Mathematica, Newton, 978-0-520-08816-0"
              value={query}
              onChange={(e) => setQueryOnly(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <SearchIcon className="mr-2 h-4 w-4" />
              {isSearching ? t("searching") : t("search")}
            </Button>
            {results.length > 0 && (
              <Button
                onClick={() => {
                  setError(null);
                  clearSearch();
                }}
                className="rounded-md bg-red-600 text-white px-4 py-2 hover:bg-red-700 max-[400px]:w-full text-sm"
              >
                <BrushCleaning className="mr-2 h-4 w-4" />
                {t("clear-button")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {t("search-results")} ({results.length})
          </h2>
          <div className="flex flex-col gap-4">
            {results.map((book) => (
              <Card key={book.id} className="hover:shadow-xl transition-shadow">
                <div className="flex gap-4 p-4">
                  {/* Book Cover */}
                  {/* <div className="w-24 h-32 flex-shrink-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center overflow-hidden">
					  <img
						src={book.coverUrl}
						alt={`Cover of ${book.title}`}
						className="w-full h-full object-cover"
						onError={(e) => {
						  e.currentTarget.style.display = 'none';
						  e.currentTarget.parentElement!.innerHTML = '<div class="text-muted-foreground"><BookOpen class="w-12 h-12" /></div>';
						}}
					  />
					</div> */}
                  <Image
                    src={`https://api.finna.fi/Cover/Show?${new URLSearchParams(
                      {
                        source: "Solr",
                        author: book.authors[0] || "",
                        callnumber: "",
                        size: "large",
                        title: book.title,
                        recordid: book.id,
                        ...(book.isbn
                          ? ({
                              invisbn: book.isbn,
                              "isbns[0]": book.isbn,
                            } as Record<string, string>)
                          : {}),
                        index: "0",
                      },
                    ).toString()}`}
                    alt={book.title}
                    width={64}
                    height={96}
                    className="w-16 h-24 object-cover rounded bg-black/5 dark:bg-white/10"
                  />

                  {/* Book Info */}
                  <div className="flex flex-1 max-[450px]:flex-col max-[450px]:gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                        <a
                          href={`https://finna.fi/Record/${book.id}`}
                          target="_blank"
                        >
                          {book.title}
                        </a>
                      </h3>
                      {book.authors.length > 0 && (
                        <p className="text-sm text-muted-foreground mb-2">
                          by {book.authors.join(", ")}
                        </p>
                      )}
                      {book.year && (
                        <p className="text-sm">
                          <span className="font-semibold">Year:</span>{" "}
                          {book.year}
                        </p>
                      )}
                      {book.library && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Library Name:</span>{" "}
                          {book.library}
                        </p>
                      )}
                      {book.isbn && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">ISBN:</span>{" "}
                          {book.isbn}
                        </p>
                      )}
                    </div>

                    <Button onClick={() => handleRequestScan(book)}>
                      {t("request-scan")}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && query && !isSearching && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("no-results")}</h3>
        </div>
      )}
    </>
  );
};
export default BookSearch;

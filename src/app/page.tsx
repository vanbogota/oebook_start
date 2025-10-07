"use client";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/LocalAuthContext";
import { usePWA } from "@/components/PWAInstaller";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  imageId: string | null;
  library: string | null;
  isbn: string | null;
};

export default function Home() {
  const { userProfile } = useAuth();
  const { installApp, isInstallable, isStandalone } = usePWA();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSearch(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setResults(data.results || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="font-sans min-h-screen p-8 mx-auto">
      {/* Header with user info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome to Open European Book</h1>
          {userProfile && (
            <p className="text-sm text-black/70 dark:text-white/70 mt-1">
              Hello, {userProfile.nickname}!
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {isInstallable() && !isStandalone() && (
            <button
              onClick={() => installApp()}
              className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
              title="Install as app"
            >
              📱 Install App
            </button>
          )}
          <button
            onClick={() => router.push('/profile')}
            className="text-sm bg-black/5 dark:bg-white/10 px-3 py-2 rounded-md hover:bg-black/10 dark:hover:bg-white/20"
          >
            Profile
          </button>
        </div>
      </div>

      <h2 className="mb-2">Find a book you want to read or print:</h2>
      <form onSubmit={onSearch} className="flex gap-2 mb-6 max-[400px]:flex-col max-[400px]:gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title or author or ISBN"
          className="flex-1 w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2"
          suppressHydrationWarning
        />
        <button
          type="submit"
          className="rounded-md bg-foreground text-background px-4 py-2 disabled:opacity-50 max-[400px]:w-full"
          disabled={loading || !query.trim()}
          suppressHydrationWarning
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
      )}

      {!loading && results.length === 0 && !error && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Enter a query and press Search.
        </p>
      )}

      <ul className="grid gap-4">
        {results.map((r) => (
          <li key={r.id} className="rounded-lg border border-black/10 dark:border-white/15 p-4">
            <div className="flex items-center gap-4">
              <Image
                src={`https://api.finna.fi/Cover/Show?${new URLSearchParams({
                  source: "Solr",
                  author: r.authors[0] || "",
                  callnumber: "",
                  size: "large",
                  title: r.title,
                  recordid: r.id,
                  ...(r.isbn ? ({ invisbn: r.isbn, "isbns[0]": r.isbn } as Record<string, string>) : {}),
                  index: "0",
                }).toString()}`}
                alt={r.title}
                width={64}
                height={96}
                className="w-16 h-24 object-cover rounded bg-black/5 dark:bg-white/10"
              />
              {/* {r.imageId ? (
                <Image
                  src={`https://api.finna.fi/Cover/Show?${new URLSearchParams({
                    source: "Solr",
                    author: r.authors[0] || "",
                    callnumber: "",
                    size: "large",
                    title: r.title,
                    recordid: r.id,
                    ...(r.isbn ? ({ invisbn: r.isbn, "isbns[0]": r.isbn } as Record<string, string>) : {}),
                    index: "0",
                  }).toString()}`}
                  alt={r.title}
                  width={64}
                  height={96}
                  className="w-16 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-24 bg-black/5 dark:bg-white/10 rounded" />
              )} */}
              <div>
                <a href={`https://finna.fi/Record/${r.id}`} className="font-medium leading-tight" target="_blank">{r.title}</a>
                {r.authors.length > 0 && (
                  <p className="text-sm text-black/70 dark:text-white/70 mt-1">
                    Authors: {r.authors.join(", ")}
                  </p>
                )}
                {r.year && (
                  <p className="text-sm text-black/70 dark:text-white/70">Year: {r.year}</p>
                )}
                {r.library && (
                  <p className="text-sm text-black/70 dark:text-white/70">Library: {r.library}</p>
                )}
              </div>
              <button className="w-min h-24 bg-black/5 dark:bg-white/10 rounded ml-auto">
                Request to scan
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

import { NextRequest } from "next/server";

type LocalizedString = string | { value: string; translated?: string };

type FinnaAuthor = {
  name?: LocalizedString;
};

type FinnaRecord = {
  id: string;
  title?: LocalizedString;
  nonPresenterAuthors?: FinnaAuthor[];
  year?: number;
  images?: string[];
  institutions?: (string | { value: string; translated?: string })[];
  buildings?: (string | { value: string; translated?: string })[];
  isbns?: string[];
};

const FINNA_SEARCH_URL = "https://api.finna.fi/api/v1/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || !query.trim()) {
    return new Response(
      JSON.stringify({ error: "Missing required 'query' parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(FINNA_SEARCH_URL);
  url.searchParams.set("lookfor", query);
  url.searchParams.set("type", "AllFields");
  url.searchParams.set("limit", "20");
  url.searchParams.set("sort", "relevance");
  // Filter only books. Finna supports format facet values like 0/Book/
  url.searchParams.append("filter[]", "format:0/Book/");
  url.searchParams.append("field[]", "id");
  url.searchParams.append("field[]", "title");
  url.searchParams.append("field[]", "nonPresenterAuthors");
  url.searchParams.append("field[]", "year");
  url.searchParams.append("field[]", "images");
  url.searchParams.append("field[]", "institutions");
  url.searchParams.append("field[]", "buildings");
  url.searchParams.append("field[]", "isbns");

  console.log(url.toString());
  try {
    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      // Disable caching for fresh results
      cache: "no-store",
    });

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: `Finna error: ${resp.status}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();

    // Helpers to normalize Finna's localized fields
    const hasStringValue = (obj: unknown): obj is { value: string } => {
      if (typeof obj !== "object" || obj === null) return false;
      const rec = obj as Record<string, unknown>;
      return typeof rec.value === "string";
    };

    const getString = (v: unknown): string => {
      if (typeof v === "string") return v;
      if (hasStringValue(v)) return v.value;
      return "";
    };

    const normalizeArrayToStrings = (arr: unknown): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .map((item) => getString(item))
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    };

    // Normalize a compact subset for the UI
    const results = Array.isArray(data?.records)
      ? (data.records as FinnaRecord[]).map((r: FinnaRecord) => {
          const authors = Array.isArray(r.nonPresenterAuthors)
            ? r.nonPresenterAuthors
                .map((a: FinnaAuthor) => getString(a?.name))
                .filter((s) => s.length > 0)
            : [];
          const institutions = normalizeArrayToStrings(r.institutions);
          const buildings = normalizeArrayToStrings(r.buildings);
          const library = institutions[0] || buildings[0] || null;

          return {
          id: r.id,
          title: getString(r.title) || 'Untitled',
            authors,
          year: r.year || null,
          images: r.images,
            library,
            isbn: Array.isArray(r.isbns) && r.isbns.length > 0 ? r.isbns[0] : null,
          };
        })
      : [];

    return new Response(JSON.stringify({ count: results.length, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Finna" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



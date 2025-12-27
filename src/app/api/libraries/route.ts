type FinnaFacetItem = {
  value: string;
  translated: string;
  count: number;
};

type FinnaSearchResponse = {
  facets?: {
    building?: FinnaFacetItem[];
  };
  status: string;
};

const FINNA_SEARCH_URL = "https://api.finna.fi/api/v1/search";

export async function GET() {
  // Use search API with building facet to get list of all organizations
  const url = new URL(FINNA_SEARCH_URL);
  url.searchParams.set("lookfor", "*");
  url.searchParams.set("limit", "0"); // We only need facets, not search results
  url.searchParams.append("facet[]", "building");

  console.log("Fetching libraries from:", url.toString());
  
  try {
    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    console.log("Finna API response status:", resp.status);

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Finna API error:", resp.status, errorText);
      return new Response(
        JSON.stringify({ error: `Finna error: ${resp.status}`, details: errorText }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data: FinnaSearchResponse = await resp.json();
    const buildingFacets = data?.facets?.building || [];
    console.log("Finna API returned", buildingFacets.length, "buildings");

    // Normalize the response - extract library-like organizations
    // We'll use some heuristics to identify libraries (contain "kirjasto", "library", etc.)
    const libraries = buildingFacets
      .filter((item) => {
        const name = item.translated.toLowerCase();
        // Filter for libraries, universities, and major cultural institutions
        return (
          name.includes('kirjasto') || 
          name.includes('library') || 
          name.includes('bibliothek') ||
          name.includes('yliopisto') ||
          name.includes('university') ||
          name.includes('universitet') ||
          name.includes('ammattikorkeakoulu') ||
          name.includes('kansalliskirjasto')
        );
      })
      .map((item) => ({
        id: item.value,
        name: item.translated,
        count: item.count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return new Response(
      JSON.stringify({ count: libraries.length, libraries }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching libraries:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch libraries from Finna" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

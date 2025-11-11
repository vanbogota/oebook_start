import { Search } from "@/components/Search";

export default function BookSearchPage() {
    // async function onSearch(e?: React.FormEvent<HTMLFormElement>) {
    //     e?.preventDefault();
    //     if (!query.trim()) return;
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
    //             method: "GET",
    //         });
    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data?.error || "Search failed");

    //         const searchResults = data.results || [];
    //         updateSearchResults(query, searchResults);
    //     } catch (err) {
    //         const message = err instanceof Error ? err.message : "Unknown error";
    //         setError(message);
    //         clearSearch();
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    return <Search />;
}
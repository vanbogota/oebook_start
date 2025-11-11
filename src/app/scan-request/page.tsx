import { ScanRequestContent } from "@/components/ScanRequestContent";
import { Suspense } from "react";

export default function ScanRequestPage() {
  return (
    <Suspense fallback={
      <main className="font-sans min-h-screen p-8 mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-black/70 dark:text-white/70">Loading...</p>
        </div>
      </main>
    }>
      <ScanRequestContent />
    </Suspense>
  );
}
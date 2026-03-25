import { Suspense } from "react";
import { RecoveryForm } from "@/components/RecoveryForm";

export default function RestorePage() {
  return (
    <Suspense fallback={null}>
      <RecoveryForm />
    </Suspense>
  );
}

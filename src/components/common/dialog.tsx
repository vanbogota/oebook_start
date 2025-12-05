"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./button";
import { useTranslations } from "next-intl";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
};

export default function Dialog({
  open,
  onOpenChange,
  children,
  title,
}: DialogProps) {
  const t = useTranslations("SignUp");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-background border rounded-lg shadow-xl max-w-lg max-h-[80vh] overflow-y-auto p-6"
      >
        <button
          onClick={() => onOpenChange(false)}
          aria-label={t("close")}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {title && <h2 className="text-2xl font-semibold mb-4 pr-8">{title}</h2>}
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
        <Button
          variant="default"
          className="mt-6 float-end"
          onClick={() => onOpenChange(false)}
        >
          {t("close")}
        </Button>
      </div>
    </div>
  );
}

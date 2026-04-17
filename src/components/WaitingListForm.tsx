"use client";

import { Printer, Upload, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./common/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./common/card";
import { Input } from "./common/input";
import { Label } from "./common/label";
import { useTranslations } from "next-intl";
import { Checkbox } from "./common/checkbox";

type FileEntry = {
  id: number;
  file: File | null;
  link: string;
};

type CompletedEntry = {
  id: number;
  file: File;
  link: string;
};

type SubmitErrorPayload = {
  error?: string;
  details?: string;
  message?: string;
};

type SubmitStatus = {
  type: "success" | "error";
  message: string;
} | null;

export default function WaitingListForm() {
  const t = useTranslations("WaitingListForm");

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([
    { id: 1, file: null, link: "" },
  ]);
  const [fileErrorsByEntry, setFileErrorsByEntry] = useState<
    Record<number, string>
  >({});
  const [linkErrorsByEntry, setLinkErrorsByEntry] = useState<
    Record<number, string>
  >({});
  const [nextId, setNextId] = useState<number>(2);
  const [dualCover, setDualCover] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const truncateError = (message: string, maxLength = 220) => {
    const normalized = message.replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, maxLength - 1)}...`;
  };

  const getResponseErrorMessage = async (response: Response) => {
    const contentType = response.headers.get("content-type") ?? "";

    try {
      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as SubmitErrorPayload;
        const details = [payload.error, payload.details, payload.message]
          .filter((value): value is string => Boolean(value?.trim()))
          .map((value) => value.trim());

        if (details.length > 0) {
          return truncateError(details.join(" "));
        }
      } else {
        const text = truncateError(await response.text());
        if (text) {
          return text;
        }
      }
    } catch (error) {
      console.error("Failed to parse waiting list error response:", error);
    }

    return t("submit-error-status", { status: response.status });
  };

  const handleEmailBlur = () => {
    if (email.trim() === "") {
      setEmailError("");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t("email-invalid-error"));
    } else {
      setEmailError("");
    }
  };

  const handleFileChange = (
    entryId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (submitStatus) setSubmitStatus(null);
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ];
      if (validTypes.includes(file.type)) {
        setFileEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, file } : entry,
          ),
        );
        setFileErrorsByEntry((prev) => {
          const next = { ...prev };
          delete next[entryId];
          return next;
        });
      } else {
        setFileEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId ? { ...entry, file: null } : entry,
          ),
        );
        setFileErrorsByEntry((prev) => ({
          ...prev,
          [entryId]: t("alert-message"),
        }));
        e.target.value = "";
      }
    }
  };

  const handleLinkChange = (entryId: number, value: string) => {
    setFileEntries((prev) => {
      const updated = prev.map((entry) =>
        entry.id === entryId ? { ...entry, link: value } : entry,
      );

      if (value.trim() !== "") {
        setLinkErrorsByEntry((prev) => {
          const next = { ...prev };
          delete next[entryId];
          return next;
        });
      }

      return updated;
    });
  };

  const addFileEntry = () => {
    setFileEntries((prev) => [...prev, { id: nextId, file: null, link: "" }]);
    setNextId((prev) => prev + 1);
  };

  const removeFileEntry = (entryId: number) => {
    if (fileEntries.length > 1) {
      setFileEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      setFileErrorsByEntry((prev) => {
        const next = { ...prev };
        delete next[entryId];
        return next;
      });
      setLinkErrorsByEntry((prev) => {
        const next = { ...prev };
        delete next[entryId];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setEmailError(t("email-invalid-error"));
      return;
    }
    setEmailError("");

    const trimmedEntries = fileEntries.map((entry) => ({
      ...entry,
      link: entry.link.trim(),
    }));

    const fileErrors: Record<number, string> = {};
    const linkErrors: Record<number, string> = {};
    let hasAnyInput = false;

    const validEntries: CompletedEntry[] = trimmedEntries
      .filter((entry): entry is CompletedEntry =>
        Boolean(entry.file && entry.link),
      )
      .map((entry) => ({
        id: entry.id,
        file: entry.file,
        link: entry.link,
      }));

    for (const entry of trimmedEntries) {
      const hasFile = Boolean(entry.file);
      const hasLink = entry.link !== "";
      if (hasFile || hasLink) {
        hasAnyInput = true;
      }

      if (hasFile !== hasLink) {
        if (!hasFile) {
          fileErrors[entry.id] = t("entry-incomplete-error");
        }
        if (!hasLink) {
          linkErrors[entry.id] = t("entry-incomplete-error");
        }
      }
    }

    if (!hasAnyInput && trimmedEntries.length > 0) {
      const firstId = trimmedEntries[0].id;
      fileErrors[firstId] = t("file-error");
      linkErrors[firstId] = t("link-error");
    }

    setFileErrorsByEntry(fileErrors);
    setLinkErrorsByEntry(linkErrors);

    if (
      Object.keys(fileErrors).length > 0 ||
      Object.keys(linkErrors).length > 0 ||
      validEntries.length === 0
    ) {
      return;
    }

    setLoading(true);

    try {
      // Send each file entry separately
      const promises = validEntries.map((entry) => {
        const formData = new FormData();
        formData.append("email", trimmedEmail);
        formData.append("file", entry.file);
        formData.append("link", entry.link);
        formData.append("dualCover", dualCover ? "true" : "false");

        return fetch("/api/waiting-list", {
          method: "POST",
          body: formData,
        });
      });

      const responses = await Promise.all(promises);
      const allSuccessful = responses.every((res) => res.ok);

      if (allSuccessful) {
        setSubmitStatus({
          type: "success",
          message: t("submit-success", { count: validEntries.length }),
        });

        setEmail("");
        setFileEntries([{ id: nextId, file: null, link: "" }]);
        setFileErrorsByEntry({});
        setLinkErrorsByEntry({});
        setDualCover(false);
        setNextId((prev) => prev + 1);
      } else {
        const failedCount = responses.filter((response) => !response.ok).length;
        const failedResponses = await Promise.all(
          responses
            .filter((response) => !response.ok)
            .map((response) => getResponseErrorMessage(response)),
        );
        const uniqueErrors = [...new Set(failedResponses)].filter(Boolean);

        setSubmitStatus({
          type: "error",
          message:
            uniqueErrors.length > 0
              ? t("submit-error-details", {
                  count: failedCount,
                  details: uniqueErrors.join(" | "),
                })
              : t("submit-error-generic"),
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error && error.message.trim()
            ? t("network-error-details", {
                details: truncateError(error.message),
              })
            : t("network-error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p>{t("description1")}</p>
        <p>{t("description2")}</p>
        <p>{t("description3")}</p>

        <p className="mt-4 font-semibold">
          {t.rich("price-info", {
            guidelines: (chunks) => (
              <a
                href="/AuthorRoyalties_en.pdf"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className="mt-4">
          {t.rich("book-size", {
            guidelines: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
        <p className="mt-4">{t("cover")}</p>
        <p className="mt-4">
          {t.rich("description4", {
            guidelines: (chunks) => (
              <a
                href="https://www.finlex.fi/api/media/statute-foreign-language-translation/689238/mainPdf/main.pdf?timestamp=1961-07-07T22%3A00%3A00.000Z"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {chunks}
              </a>
            ),
            guidelines2: (chunks) => (
              <span className="font-semibold">{chunks}</span>
            ),
          })}
        </p>
        <p className="mt-4">{t("description7")}</p>
        <p className="mt-4">
          {t.rich("description5", {
            guidelines: (chunks) => (
              <a
                href="/PrintGuide-1.pdf"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className="mt-4 text-red-500">{t("description6")}</p>
      </CardContent>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email-label")}</Label>
          <CardDescription>{t("avoid-real-name")}</CardDescription>
          <Input
            id="email"
            type="email"
            placeholder={t("email-placeholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitStatus) setSubmitStatus(null);
              if (emailError) setEmailError("");
            }}
            onBlur={handleEmailBlur}
            className={`transition-all focus:ring-2 focus:ring-primary/20 ${
              emailError ? "border-red-500" : ""
            }`}
            required
            disabled={loading}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        {fileEntries.map((entry) => (
          <div
            key={entry.id}
            className="space-y-4 p-4 border rounded-lg bg-secondary/20 relative"
          >
            {fileEntries.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFileEntry(entry.id)}
                disabled={loading}
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-2">
              <Label
                htmlFor={`fileUpload-${entry.id}`}
                className="text-sm font-medium"
              >
                {t("library-receipt")}
              </Label>
              <CardDescription>
                Supported files: .jpg, .jpeg, .png, .webp, .heic, .heif.
              </CardDescription>
              <div className="flex flex-col gap-2">
                <Input
                  id={`fileUpload-${entry.id}`}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
                  onChange={(e) => handleFileChange(entry.id, e)}
                  className="cursor-pointer"
                  disabled={loading}
                />
                {entry.file && (
                  <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    {entry.file.name}
                  </div>
                )}
                {fileErrorsByEntry[entry.id] && (
                  <p className="text-sm text-red-500">
                    {fileErrorsByEntry[entry.id]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`link-${entry.id}`}
                className="text-sm font-medium"
              >
                {t("add-link")}
              </Label>
              <CardDescription>{t("link-instruction")}</CardDescription>
              <Input
                id={`link-${entry.id}`}
                placeholder={t("link-placeholder")}
                value={entry.link}
                onChange={(e) => handleLinkChange(entry.id, e.target.value)}
                disabled={loading}
              />
              {linkErrorsByEntry[entry.id] && (
                <p className="text-sm text-red-500">
                  {linkErrorsByEntry[entry.id]}
                </p>
              )}
            </div>
          </div>
        ))}
        <div className="mt-2 flex items-center">
          <Checkbox
            id="dual-cover"
            checked={dualCover}
            onCheckedChange={(checked) => {
              setDualCover(checked as boolean);
              if (submitStatus) setSubmitStatus(null);
            }}
          />
          <Label htmlFor="dual-cover" className="text-sm font-medium ml-2">
            {t("dual-cover")}
          </Label>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={addFileEntry}
          disabled={loading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add more files
        </Button>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Printer className="mr-2 h-4 w-4" />
          {loading ? t("submitting") : t("submit-button")}
        </Button>
        {submitStatus && (
          <p
            className={`text-sm ${
              submitStatus.type === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {submitStatus.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}



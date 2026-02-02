"use client";

import { Printer, Upload, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./common/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./common/card";
import { Input } from "./common/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./common/label";
import { useTranslations } from "next-intl";

type FileEntry = {
    id: number;
    file: File | null;
    link: string;
};

export default function WaitingListForm() {
    const { toast } = useToast();
    const t = useTranslations("WaitingListForm");

    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fileEntries, setFileEntries] = useState<FileEntry[]>([
        { id: 1, file: null, link: "" }
    ]);
    const [nextId, setNextId] = useState<number>(2);

    const handleEmailBlur = () => {
        if (email.trim() === "") {
            setEmailError("");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    const handleFileChange = (entryId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
                'image/heic',
                'image/heif',
            ];
            if (validTypes.includes(file.type)) {
                setFileEntries(prev =>
                    prev.map(entry =>
                        entry.id === entryId ? { ...entry, file } : entry
                    )
                );
            } else {
                alert(t("alert-message"));
                e.target.value = '';
            }
        }
    };

    const handleLinkChange = (entryId: number, value: string) => {
        setFileEntries(prev =>
            prev.map(entry =>
                entry.id === entryId ? { ...entry, link: value } : entry
            )
        );
    };

    const addFileEntry = () => {
        setFileEntries(prev => [...prev, { id: nextId, file: null, link: "" }]);
        setNextId(prev => prev + 1);
    };

    const removeFileEntry = (entryId: number) => {
        if (fileEntries.length > 1) {
            setFileEntries(prev => prev.filter(entry => entry.id !== entryId));
        }
    };

    const handleSubmit = async () => {
        if (!email || emailError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: emailError || t("required-fields"),
            });
            return;
        }

        const validEntries = fileEntries.filter(entry => entry.file && entry.link);

        if (validEntries.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: t("alert-no-file"),
            });
            return;
        }


        setLoading(true);

        try {
            // Send each file entry separately
            const promises = validEntries.map(entry => {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('file', entry.file!);
                formData.append('link', entry.link);

                return fetch('/api/waiting-list', {
                    method: 'POST',
                    body: formData,
                });
            });

            const responses = await Promise.all(promises);
            const allSuccessful = responses.every(res => res.ok);

            if (allSuccessful) {
                toast({
                    title: "Success!",
                    description: `You were successfully added to the waiting list with ${validEntries.length} file(s)!`,
                });

                setEmail('');
                setFileEntries([{ id: nextId, file: null, link: "" }]);
                setNextId(prev => prev + 1);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Some files failed to submit. Please try again.",
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Network error. Please check your connection and try again.",
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
                    <p className="mt-4">{t.rich("description4", { guidelines: (chunks) => <a href="https://www.finlex.fi/api/media/statute-foreign-language-translation/689238/mainPdf/main.pdf?timestamp=1961-07-07T22%3A00%3A00.000Z" className="underline" target="_blank" rel="noopener noreferrer">{chunks}</a>
                })}</p>
                    <p className="mt-4">{t.rich("description5", { guidelines: (chunks) => <a href="/printGuide.pdf" className="underline text-red" target="_blank" rel="noopener noreferrer">{chunks}</a>
                })}</p>
                    <p className="mt-4 text-red-500">{t("description6")}</p>
            </CardContent>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">{t("email-label")}</Label>
                    <CardDescription>
                        {t("avoid-real-name")}
                    </CardDescription>
                    <Input
                        id="email"
                        type="email"
                        placeholder={t("email-placeholder")}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                        }}
                        onBlur={handleEmailBlur}
                        className={`transition-all focus:ring-2 focus:ring-primary/20 ${emailError ? "border-red-500" : ""
                            }`}
                        required
                        disabled={loading}
                    />
                    {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                    )}
                </div>

                {fileEntries.map((entry, index) => (
                    <div key={entry.id} className="space-y-4 p-4 border rounded-lg bg-secondary/20 relative">
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
                            <Label htmlFor={`fileUpload-${entry.id}`} className="text-sm font-medium">
                                {t("library-receipt")}
                            </Label>
                            <CardDescription>
                                Supported files: .jpg, .jpeg, .png, .webp, .heic, .heif.
                            </CardDescription>
                            <div className="flex items-center gap-2">
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
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`link-${entry.id}`} className="text-sm font-medium">
                                {t("add-link")}
                            </Label>
                            <CardDescription>
                                {t("link-instruction")}
                            </CardDescription>
                            <Input
                                id={`link-${entry.id}`}
                                placeholder={t("link-placeholder")}
                                value={entry.link}
                                onChange={(e) => handleLinkChange(entry.id, e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={addFileEntry}
                    disabled={loading}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add more files
                </Button>

                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t("submit-button")}
                </Button>
            </CardContent>
        </Card>
    );
}
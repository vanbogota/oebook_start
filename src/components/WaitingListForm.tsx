"use client";

import { Printer, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "./common/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./common/card";
import { Input } from "./common/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./common/label";
import { useTranslations } from "next-intl";

export default function WaitingListForm() {
    const { toast } = useToast();
    const t = useTranslations("WaitingListForm");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [zipCode, setZipCode] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [link, setLink] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/svg+xml'
            ];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
            } else {
                alert(t("alert-message"));
                e.target.value = '';
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast({
                variant: "destructive",
                title: "Error",
                description: t("alert-no-file"),
            });
            return;
        }

        if (!link || !zipCode || !email) {
            toast({
                variant: "destructive",
                title: "Error",
                description: t("required-fields"),
            });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('zipCode', zipCode);
        formData.append('file', selectedFile);
        formData.append('link', link);

        try {
            const response = await fetch('/api/waiting-list', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success!",
                    description: "You've been added to the waiting list!",
                });

                setEmail('');
                setZipCode('');
                setLink('');
                setSelectedFile(null);
                const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.error || "Failed to submit form. Please try again.",
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
                    <p className="mt-4">{t.rich("description4", { guidlines: (chunks) => <a href="#" target="_blank">{chunks}</a>})}</p>
                    <p className="mt-4 text-red-500">{t("description5")}</p>
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
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">{t("zip-label")}</Label>
                    <Input
                        id="zipCode"
                        type="number"
                        placeholder={t("zip-placeholder")}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fileUpload" className="text-sm font-medium">{t("library-receipt")}</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="fileUpload"
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {selectedFile && (
                            <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                <Upload className="h-4 w-4" />
                                {selectedFile.name}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="link" className="text-sm font-medium">{t("add-link")}</Label>
                    <CardDescription>
                        {t("link-instruction")}
                    </CardDescription>
                    <Input
                        id="link"
                        placeholder={t("link-placeholder")}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
                    <Printer className="mr-2 h-4 w-4" />
                    {t("submit-button")}
                </Button>
            </CardContent>
        </Card>
    );
}
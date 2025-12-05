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
                <CardTitle>Join The Waiting List</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                    <p>Be among the first to receive your printed book!</p>
                    <p>As we`re just starting out, we`re currently collecting our first orders.</p>
                    <p>Join the waiting list by filling out the form below.</p>
                    <p className="mt-4">We will print the book you want. Please provide a correct PDF file. Use the instructions: <a href="#" target="_blank">here</a></p>
                    <p className="mt-4 text-red-500">Attention: The book, that you scan, must be obtained legally, by EU law. This means you must have a photo of the library checkout receipt. Please upload it below.</p>
                    {/* {t("description")} */}
            </CardContent>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <CardDescription>
                        Please avoid showing your real name, for your privacy
                    </CardDescription>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code of Delivery Address</Label>
                    <Input
                        id="zipCode"
                        type="number"
                        placeholder="Enter zip code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fileUpload" className="text-sm font-medium">Add a Photo of The Library Checkout Receipt</Label>
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
                    <Label htmlFor="link" className="text-sm font-medium">Add a Link to a Book File From Your Storage</Label>
                    <CardDescription>
                        A link to the book file should be publicly accessible for download. Avoid personal data in the link name.
                    </CardDescription>
                    <Input
                        id="link"
                        placeholder="Enter link to book file here"
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
"use client";

import { Printer, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./common/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./common/card";
import { Input } from "./common/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./common/select";
import { Label } from "./common/label";
import DELIVERY_PROVIDERS from "@/data/delivery-providers";
import { Locker } from "@/types/interfaces";

export default function PrintRequestForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<string>();
    const [zipCode, setZipCode] = useState<string>("");
    const { toast } = useToast();
    const [lockers, setLockers] = useState<Locker[]>([]);
    const [selectedLocker, setSelectedLocker] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<string>("");

    useEffect(() => {
        async function fetchLockers() {
            if (!selectedProvider) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/lockers?provider=${selectedProvider}&zipCode=${zipCode}`);
                const data = await res.json();
                console.log("Fetched lockers:", data);
                setLockers(data || []);
            } finally {
                setLoading(false);
            }
        }
        fetchLockers();
    }, [zipCode, selectedProvider]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
            } else {
                alert('Please select a Word or PDF file');
                e.target.value = '';
            }
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a file",
            });
            return;
        }

        if (!selectedProvider || !zipCode || !selectedLocker) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all required fields",
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('provider', selectedProvider);
        formData.append('zipCode', zipCode);
        formData.append('locker', selectedLocker);
        formData.append('additionalInfo', additionalInfo);

        // TODO: Implement API call to upload file
        toast({
            title: "File ready for upload",
            description: (
                <div className="whitespace-pre-line">
                    {`1. Go to the Posti website:
https://www.posti.fi/en/private/send

2. Select "Send Parcel"

3. Enter the sending address:
{Adress of Smartpaper}

4. Enter your delivery address:
Parcel Locker FI123456

5. Enter your phone number

6. Pay for delivery`}
                </div>
            ),
        });
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Book Print Order</CardTitle>
                <CardDescription>
                    Fill out the form to order the printing of a book
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="provider">Choose Delivery Provider</Label>
                    <Select value={selectedProvider} onValueChange={setSelectedProvider} required>
                        <SelectTrigger id="provider" className="transition-all focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select a delivery provider" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                            {DELIVERY_PROVIDERS.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                    {provider.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">Enter Your Zip Code</Label>
                    <Input
                        id="zipCode"
                        type="number"
                        placeholder={selectedProvider ? `Enter your zip code` : `Choose a delivery provider first...`}
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        // disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="locker">Choose Delivery Locker</Label>
                    <Select value={selectedLocker} onValueChange={setSelectedLocker} required>
                        <SelectTrigger id="locker" className="transition-all focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder={selectedProvider ? zipCode ? `Select a parcel locker` : `Enter your zip code first...` : `Choose a delivery provider first...`} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                            {lockers.map((locker) => (
                                <SelectItem key={locker.id} value={locker.name}>
                                    {locker.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-sm font-medium">Additional Information</Label>
                    <Input 
                        id="additionalInfo" 
                        placeholder="Special requests" 
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fileUpload" className="text-sm font-medium">Upload the Source File of the Book (in Word or PDF)</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
                    <Printer className="mr-2 h-4 w-4" />
                    Submit Order
                </Button>
            </CardContent>
        </Card>
    );
}
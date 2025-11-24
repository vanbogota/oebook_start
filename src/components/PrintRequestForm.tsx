"use client";

import { Printer, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "./common/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./common/card";
import { Input } from "./common/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./common/label";

export default function PrintRequestForm() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [zipCode, setZipCode] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [address, setAddress] = useState<string>("");

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

        if (!phone || !zipCode || !address) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all required fields",
            });
            return;
        }

        const formData = new FormData();
        formData.append('phone', phone);
        formData.append('zipCode', zipCode);
        formData.append('address', address);
        formData.append('file', selectedFile);


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
                <CardTitle>Paper Book Order</CardTitle>
                <CardDescription>
                    Fill out the form to order the paper book
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Enter Your Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code of Delivery Address</Label>
                    <Input
                        id="zipCode"
                        type="number"
                        placeholder="Enter your postal code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        required
                        disabled={loading}
                    />
                </div>                
                <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Delivery Address</Label>
                    <Input 
                        id="address"
                        placeholder="Street Name, Apt.Number, City"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={loading}
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
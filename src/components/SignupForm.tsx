'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/LocalAuthContext";
import { useToast } from "@/hooks/use-toast";
import LIBRARIES from "@/data/libraries";

export const SignupForm = () => {
  const { createUserProfile } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }
    
    if (!selectedLibrary) {
      setError("Please select your nearest library");
      return;
    }
    
    if (!acceptedTerms) {
      setError("Please accept the terms of service");
      return;
    }

    setError(null);
    
    try {
      await createUserProfile(nickname.trim(), selectedLibrary);
      
      // Профиль создан успешно, перенаправляем на страницу поиска
      router.push("/book-search");
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error while creating profile", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">Join Open Europe Book</CardTitle>
            <CardDescription className="text-base mt-2">
              Connect with readers across Europe to find and share rare books
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">Create Nickname</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="library">Choose Nearest Library</Label>
              <Select value={selectedLibrary} onValueChange={setSelectedLibrary} required>
                <SelectTrigger id="library" className="transition-all focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select a library" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {LIBRARIES.map((library) => (
                    <SelectItem key={library.id} value={library.id}>
                      {library.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                className="mt-1"
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                I accept the terms of service. I understand that copying books on this platform is FOR PRIVATE USE ONLY. I checked my country&apos;s copyright laws and confirm that I am allowed to copy books for personal use.
              </Label>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"              
              disabled={!acceptedTerms || !nickname.trim() || !selectedLibrary}>
                Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
'use client'
import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Checkbox } from "@/components/common/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card";
import { BookOpen, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/LocalAuthContext";
import { useToast } from "@/hooks/use-toast";
import LIBRARIES from "@/data/libraries";
import { useNavigation } from "@/hooks/useNavigation";
import { useTranslations } from 'use-intl';
import { useRouter } from 'next/navigation';

export const SignupForm = () => {
  const { createUserProfile } = useAuth();
  const [nickname, setNickname] = useState("");
  const [selectedLibrary, setSelectedLibrary] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("SignUp");
  const { navigateToMain, router } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError(t("nickname-required"));
      return;
    }

    if (!selectedLibrary) {
      setError(t("library-required"));
      return;
    }

    if (!acceptedTerms) {
      setError(t("terms-required"));
      return;
    }

    setError(null);

    try {
      await createUserProfile(nickname.trim(), selectedLibrary);
      navigateToMain();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error while creating profile",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCopyCode = async () => {
    if (recoveryCode) {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
      toast({
        title: "Recovery code copied!",
        description: "Save it in a safe place.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    navigateToMain();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">{t("title")} OpenEuropeBooks™</CardTitle>
            <CardDescription className="text-base mt-2">
              {t("description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!recoveryCode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nickname">{t("nickname-label")}</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder={t("nickname-placeholder")}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="library">{t("library-label")}</Label>
                <Select value={selectedLibrary} onValueChange={setSelectedLibrary} required>
                  <SelectTrigger id="library" className="transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder={t("library-placeholder")} />
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
                  {t("terms-label")}
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
                {t("create-account")}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Already have an account?
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/restore')}
                  className="text-primary"
                >
                  Restore from Recovery Code
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  ✓ Account created successfully!
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Your recovery code has been generated. Save it in a safe place - you&apos;ll need it to restore access to your account.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recovery-code" className="text-base font-semibold">
                  Your Recovery Code
                </Label>
                <div className="relative">
                  <Input
                    id="recovery-code"
                    type="text"
                    value={recoveryCode}
                    readOnly
                    className="font-mono text-lg pr-12 bg-muted/50 cursor-text select-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Write this code down or save it securely. You won&apos;t be able to see it again.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Important:</strong> This recovery code is the only way to restore access to your account on another device. Keep it safe!
                </p>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full"
                size="lg"
              >
                Continue to App
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Already have an account?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/restore')}
                  className="w-full"
                >
                  Restore from Recovery Code
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
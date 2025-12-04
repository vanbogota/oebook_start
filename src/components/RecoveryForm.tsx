'use client'
import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card";
import { KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RecoveryForm = () => {
  const [recoveryCode, setRecoveryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRecoveryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecoveryCode(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recoveryCode.trim()) {
      setError("Please enter your user ID");
      return;
    }

    setError("Profile recovery is not available in demo mode. Your profile is stored locally on this device only.");

    toast({
      title: "Recovery not available",
      description: "Without a backend database, profiles cannot be recovered across devices. Your data is stored locally only.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <KeyRound className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">Restore Your Account</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your recovery code to restore access to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recovery-code">Recovery Code</Label>
              <Input
                id="recovery-code"
                type="text"
                placeholder="demo-user-XXXXX"
                value={recoveryCode}
                onChange={handleRecoveryCodeChange}
                className="transition-all focus:ring-2 focus:ring-primary/20 font-mono text-lg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Note: Profile recovery is not available without a backend. Profiles are stored locally only.
              </p>
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!recoveryCode.trim()}
            >
              Try Recovery (Demo Mode)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

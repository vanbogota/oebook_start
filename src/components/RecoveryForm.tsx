"use client";

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/LocalAuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/LocalAuthContext";
import { useNavigation } from "@/hooks/useNavigation";

export const RecoveryForm = () => {
  const { signInWithEmail } = useAuth();
  const { navigateToMain, navigateFromSignUp, router } = useNavigation();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email.trim(), password);
      const redirectTo = searchParams.get("redirectTo");
      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo);
      } else {
        navigateToMain();
      }
    } catch (signInError) {
      console.error("Sign-in error:", signInError);
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Failed to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/30 to-background">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <LogIn className="w-8 h-8 text-primary-foreground" />
            <LogIn className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-3xl">Sign In</CardTitle>
            <CardTitle className="text-3xl">Sign In</CardTitle>
            <CardDescription className="text-base mt-2">
              Use your email and password to access your account
              Use your email and password to access your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="transition-all focus:ring-2 focus:ring-primary/20"
                required
              />
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
              disabled={loading || !email.trim() || !password.trim()}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={navigateFromSignUp}
            >
              Back
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
};

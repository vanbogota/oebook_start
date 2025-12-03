'use client'
import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/common/card";
import { KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigation } from "@/hooks/useNavigation";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatRecoveryCode, isValidRecoveryCode } from '@/utils/recoveryCode';
import { UserProfile } from '@/types/interfaces';

export const RecoveryForm = () => {
  const [recoveryCode, setRecoveryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { navigateToMain } = useNavigation();

  const handleRecoveryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRecoveryCode(e.target.value);
    setRecoveryCode(formatted);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recoveryCode.trim()) {
      setError("Please enter your recovery code");
      return;
    }

    if (!isValidRecoveryCode(recoveryCode)) {
      setError("Invalid recovery code format. Expected format: XXXX-XXXX-XXXX-XXXX");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Ищем пользователя по recovery code в Firebase
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('recoveryCode', '==', recoveryCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError("Recovery code not found. Please check and try again.");
        setLoading(false);
        return;
      }

      // Получаем первый (и единственный) документ
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const uid = userDoc.id;

      const userProfile: UserProfile = {
        uid,
        nickname: userData.nickname,
        library: userData.library,
        recoveryCode: userData.recoveryCode,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };

      // Сохраняем в localStorage
      localStorage.setItem('oebook_uid', uid);
      localStorage.setItem('oebook_profile', JSON.stringify(userProfile));

      toast({
        title: "Account restored successfully!",
        description: `Welcome back, ${userData.nickname}!`,
      });

      // Перенаправляем на главную страницу
      setTimeout(() => {
        navigateToMain();
      }, 500);
    } catch (error) {
      console.error('Error restoring account:', error);
      setError("Failed to restore account. Please try again.");
      toast({
        title: "Error restoring account",
        description: "Please check your recovery code and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
                placeholder="XXXX-XXXX-XXXX-XXXX"
                value={recoveryCode}
                onChange={handleRecoveryCodeChange}
                className="transition-all focus:ring-2 focus:ring-primary/20 font-mono text-lg"
                maxLength={19}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Enter the 16-character code you received when you created your account
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
              disabled={!recoveryCode.trim() || loading}
            >
              {loading ? "Restoring..." : "Restore Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/LocalAuthContext';
import LIBRARIES from '@/data/libraries';
import { useTranslations } from 'next-intl';
import { useNavigation } from '@/hooks/useNavigation';


export default function ProfilePage() {
  const { userProfile, updateUserProfile, signOut } = useAuth();
  const t = useTranslations('Profile');
  const { navigateToSearch, navigateToHome } = useNavigation();


  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(userProfile?.nickname || '');
  const [library, setLibrary] = useState(userProfile?.library || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLibraryName = (libraryId: string) => {
    const lib = LIBRARIES.find(l => l.id === libraryId);
    return lib ? lib.name : libraryId;
  };

  const handleEdit = () => {
    setNickname(userProfile?.nickname || '');
    setLibrary(userProfile?.library || '');
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setNickname(userProfile?.nickname || '');
    setLibrary(userProfile?.library || '');
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError(t("nickname-required"));
      return;
    }

    if (!library) {
      setError(t("library-required"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUserProfile({
        nickname: nickname.trim(),
        library,
      });
      setIsEditing(false);
    } catch (err) {
      setError(t("error-saving"));
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigateToHome();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (!userProfile) {
    return (
      <main className="font-sans min-h-screen p-8 mx-auto flex items-center justify-center">
        <div className="text-center">
          <p>{t("loading-message")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans min-h-screen p-8 mx-auto">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">{t("title")}</h1>
            <p className="text-black/70 dark:text-white/70 mt-1">
              {t("manage-profile")}
            </p>
          </div>
          <button
            onClick={navigateToSearch}
            className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          >
            ← {t("back-to-search")}
          </button>
        </div>

        {/* Информация о профиле */}
        <div className="rounded-lg border border-black/10 dark:border-white/15 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">{t("profile-info")}</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="text-sm bg-black/5 dark:bg-white/10 px-3 py-1 rounded-md hover:bg-black/10 dark:hover:bg-white/20"
              >
                {t("edit-button")}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("nickname-label")}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2"
                  maxLength={50}
                />
              ) : (
                <p className="text-black/70 dark:text-white/70">
                  {userProfile.nickname}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("library-label")}
              </label>
              {isEditing ? (
                <select
                  value={library}
                  onChange={(e) => setLibrary(e.target.value)}
                  className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-2"
                >
                  <option value="">{t("library-placeholder")}</option>
                  {LIBRARIES.map((lib) => (
                    <option key={lib.id} value={lib.id}>
                      {lib.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-black/70 dark:text-white/70">
                  {getLibraryName(userProfile.library)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("registration-date")}
              </label>
              <p className="text-black/70 dark:text-white/70">
                {userProfile.createdAt.toLocaleDateString('en-US')}
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-md bg-foreground text-background px-4 py-2 disabled:opacity-50"
              >
                {loading ? t('saving') : t('save')}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="rounded-md border border-black/10 dark:border-white/20 px-4 py-2 disabled:opacity-50"
              >
                {t("cancel-button")}
              </button>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="rounded-lg border border-black/10 dark:border-white/15 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
              <div className="text-2xl font-semibold">0</div>
              <div className="text-sm text-black/60 dark:text-white/60">
                {t("scan-requests")}
              </div>
            </div>
            <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
              <div className="text-2xl font-semibold">0</div>
              <div className="text-sm text-black/60 dark:text-white/60">
                {t("found-books")}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-lg border border-black/10 dark:border-white/15 p-6">
          <h2 className="text-lg font-medium mb-4">Actions</h2>
          <button
            onClick={handleSignOut}
            className="w-full rounded-md border border-red-300 text-red-600 dark:text-red-400 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {t("signout-button")}
          </button>
        </div>
      </div>
    </main>
  );
}
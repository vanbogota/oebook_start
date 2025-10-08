"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/LocalAuthContext';

// Пример списка библиотек (позже можете заменить на динамический список)
const LIBRARIES = [
  { id: 'national-library-finland', name: 'National Library of Finland' },
  { id: 'helsinki-city-library', name: 'Helsinki City Library' },
  { id: 'turku-city-library', name: 'Turku City Library' },
  { id: 'tampere-city-library', name: 'Tampere City Library' },
  { id: 'aalto-university-library', name: 'Aalto University Library' },
  { id: 'university-of-helsinki-library', name: 'University of Helsinki Library' },
];

export default function OnboardingPage() {
  const { completeProfile } = useAuth();
  const [nickname, setNickname] = useState('');
  const [library, setLibrary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }
    
    if (!library) {
      setError('Please select a library');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await completeProfile(nickname.trim(), library);
    } catch (err) {
      setError('Ошибка при сохранении профиля. Попробуйте еще раз.');
      console.error('Profile completion error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans min-h-screen px-8 pb-6 pt-8 mx-auto flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Welcome to<br />Open Europe Books
          </h1>
          <p className="text-black/70 dark:text-white/70 mb-2">
            (Application is in test mode)
          </p>
          <p className="text-black/70 dark:text-white/70">
            To get started, please complete your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="nickname" 
              className="block text-sm font-medium mb-2"
            >
              Desired nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-3 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label 
              htmlFor="library" 
              className="block text-sm font-medium mb-2"
            >
              Your nearest library
            </label>
            <select
              id="library"
              value={library}
              onChange={(e) => setLibrary(e.target.value)}
              className="w-full rounded-md border border-black/10 dark:border-white/20 bg-transparent px-3 py-3 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              required
            >
              <option value="">Choose library</option>
              {LIBRARIES.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <p className="block text-sm font-medium mb-2">Please confirm you are a human</p>
            <button
              type="button"
              className="w-full rounded-md bg-foreground text-background px-4 py-3 font-medium transition-opacity hover:opacity-80 mb-4"
            >
              Confirm
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !nickname.trim() || !library}
            className="w-full rounded-md bg-foreground text-background px-4 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>

        <div className="flex mt-8 text-center text-sm text-black/60 dark:text-white/60">
          <input type="checkbox" className="mr-2" />
          <p>
            Here will be sign for agree with terms of use
          </p>
        </div>
      </div>
    </main>
  );
}
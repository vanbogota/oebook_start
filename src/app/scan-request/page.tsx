"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/LocalAuthContext";
import { clearSearchCache, hasSavedResults, type SearchResult as BookDetails } from "@/utils/searchCache";

function ScanRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Извлекаем данные книги из URL параметров
  const bookData: BookDetails = {
    id: searchParams.get('id') || '',
    title: searchParams.get('title') || '',
    authors: searchParams.get('authors')?.split(',') || [],
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : null,
    library: searchParams.get('library'),
    isbn: searchParams.get('isbn'),
    imageId: null, // URL параметры не содержат imageId
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      // Здесь будет логика отправки запроса на сервер
      // Пока что имитируем отправку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Scan request submitted:', {
        book: bookData,
        user: userProfile?.nickname,
        timestamp: new Date().toISOString(),
      });
      
      clearSearchCache();
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting scan request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToSearch = () => {
    // Проверяем, есть ли сохраненные результаты поиска
    if (hasSavedResults()) {
      // Если есть сохраненные результаты, возвращаемся на главную страницу
      router.push('/');
    } else {
      // Если нет сохраненных результатов, используем browser.back()
      router.back();
    }
  };

  if (submitted) {
    return (
      <main className="font-sans min-h-screen p-8 mx-auto max-w-2xl">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Request Submitted Successfully!</h1>
            <p className="text-black/70 dark:text-white/70">
              Your scan request has been submitted. We&apos;ll process it and get back to you soon.
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-black/5 dark:bg-white/10 rounded-md hover:bg-black/10 dark:hover:bg-white/20"
            >
              Back to Search
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90"
            >
              View Profile
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!bookData.title) {
    return (
      <main className="font-sans min-h-screen p-8 mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">No Book Selected</h1>
          <p className="text-black/70 dark:text-white/70 mb-6">
            No book information was provided. Please go back to search and select a book.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90"
          >
            Back to Search
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="font-sans min-h-screen p-8 mx-auto max-w-2xl">
      <div className="mb-6">
        <button
          onClick={handleBackToSearch}
          className="flex items-center gap-2 text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white mb-4"
        >
          ← Back to search results
        </button>
        <h1 className="text-2xl font-semibold">Confirm Scan Request</h1>
        <p className="text-black/70 dark:text-white/70 mt-1">
          Please confirm the details of the book you want to request for scanning.
        </p>
      </div>

      <div className="bg-black/5 dark:bg-white/10 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Book Details</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
              Title
            </label>
            <p className="text-base">{bookData.title}</p>
          </div>

          {bookData.authors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                Authors
              </label>
              <p className="text-base">{bookData.authors.join(', ')}</p>
            </div>
          )}

          {bookData.year && (
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                Year
              </label>
              <p className="text-base">{bookData.year}</p>
            </div>
          )}

          {bookData.isbn && (
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                ISBN
              </label>
              <p className="text-base">{bookData.isbn}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium mb-2">Request Information</h3>
        <p className="text-sm text-black/70 dark:text-white/70">
          Requested by: <strong>{userProfile?.nickname}</strong><br />
          Request date: <strong>{new Date().toLocaleDateString()}</strong>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleBackToSearch}
          className="flex-1 px-4 py-3 bg-black/5 dark:bg-white/10 rounded-md hover:bg-black/10 dark:hover:bg-white/20"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitRequest}
          className="flex-1 px-4 py-3 bg-foreground text-background rounded-md hover:opacity-90 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Request'}
        </button>
      </div>
    </main>
  );
}

export default function ScanRequestPage() {
  return (
    <Suspense fallback={
      <main className="font-sans min-h-screen p-8 mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-black/70 dark:text-white/70">Loading...</p>
        </div>
      </main>
    }>
      <ScanRequestContent />
    </Suspense>
  );
}
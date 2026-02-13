"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-text-muted mb-6 max-w-md">
        An unexpected error occurred. Try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-black text-ocean-blue mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-text-muted mb-6 max-w-md">
        This page doesn&apos;t exist. Maybe the setlist changed.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

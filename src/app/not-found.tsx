import Link from "next/link";


export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-6">
      <h1 className="font-serif text-6xl font-bold mb-4 text-[var(--color-foreground)]">404</h1>
      <h2 className="text-xl font-medium mb-6 text-[var(--color-brand-graphite)]">Page not found</h2>
      <p className="text-center text-sm text-[var(--color-brand-graphite)] max-w-md mb-8">
        Oops! We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you mistyped the URL.
      </p>
      <Link 
        href="/"
        className="group flex items-center bg-[var(--color-foreground)] text-[var(--color-background)] px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-all"
      >
        
        Return Home
      </Link>
    </div>
  );
}

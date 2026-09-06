import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl mb-4">
        404
      </div>
      <h1 className="font-heading font-bold text-2xl text-secondary mb-2">Page Not Found</h1>
      <p className="text-sm text-muted mb-6 max-w-md">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary text-sm">
        Back to Home
      </Link>
    </div>
  );
}

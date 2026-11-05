import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="d-flex min-vh-100 flex-column align-items-center justify-content-center gap-2 p-4 text-center">
      <p className="display-1 fw-bold text-primary mb-0">404</p>
      <h1 className="h5 fw-semibold">Page not found</h1>
      <p className="text-secondary small">The page you are looking for does not exist.</p>
      <Link href="/dashboard" className="btn btn-primary mt-2">Back to dashboard</Link>
    </div>
  );
}

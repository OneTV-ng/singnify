import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/home"
        className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:opacity-90"
      >
        Go Home
      </Link>
    </div>
  );
}

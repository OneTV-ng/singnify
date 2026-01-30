import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          href="/home"
          className="rounded-lg bg-black px-6 py-3 text-white hover:opacity-90"
        >
          Go Home
        </Link>

        <Link
          href="/profile"
          className="rounded-lg border px-6 py-3 hover:bg-gray-50"
        >
          Profile
        </Link>
      </div>
    </div>
  );
} // ← This closing brace was missing


import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Forbidden</h2>
        <p className="text-gray-600">You don't have access to that page.</p>
      </div>
      <Link
        href="/app"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}

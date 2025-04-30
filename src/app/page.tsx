import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Fragrance Palette</h1>
      <p className="text-gray-600 mb-6">
        Generate bespoke fragrance formulas with AI.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          href="/generate"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Generate
        </Link>
        <Link
          href="/my-formulas"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
        >
          My Formulas
        </Link>
      </div>
    </div>
  );
}

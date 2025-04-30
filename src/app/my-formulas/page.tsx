"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Formula {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  topNote: string;
  middleNote: string;
  baseNote: string;
  mixing: string;
  fragranceFamily: {
    name: string;
    description: string;
  };
}

export default function MyFormulas() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const res = await fetch("/api/formulas");
        if (!res.ok) {
          throw new Error("Failed to fetch formulas");
        }
        const data = await res.json();
        setFormulas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormulas();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My Fragrance Formulas</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My Fragrance Formulas</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Fragrance Formulas</h1>
        <button
          onClick={() => router.push("/generate")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Formula
        </button>
      </div>

      {formulas.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">
            You haven&apos;t created any formulas yet.
          </p>
          <button
            onClick={() => router.push("/generate")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Formula
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {formulas.map((formula) => (
            <Card
              key={formula.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-3 flex justify-between">
                <h3 className="font-bold text-xl">{formula.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {formula.fragranceFamily.name}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{formula.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  Notes
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="block text-gray-500">Top</span>
                    <span>{formula.topNote}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Middle</span>
                    <span>{formula.middleNote}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Base</span>
                    <span>{formula.baseNote}</span>
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <h4 className="font-semibold text-sm text-gray-700 mb-1">
                  Mixing Instructions
                </h4>
                <p className="text-sm">{formula.mixing}</p>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                Created on {new Date(formula.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/formulas/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate formula");
      }

      const data = await res.json();
      router.push(`/my-formulas`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Generate Fragrance Formula</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Describe your desired fragrance</Label>
            <p className="text-sm text-gray-500 mb-2">
              Describe the kind of scent you want (e.g., "Fresh citrus with
              woody base" or "Sweet floral with vanilla notes")
            </p>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[120px]"
              placeholder="Describe your desired fragrance..."
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Our AI will generate a simple three-note formula based on your
              description
            </p>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">How it works</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Enter a description of the fragrance you want to create</li>
          <li>
            Our AI will identify the fragrance family that best matches your
            description
          </li>
          <li>The AI will suggest appropriate top, middle, and base notes</li>
          <li>
            You'll get simple mixing instructions to create your fragrance
          </li>
        </ul>
      </div>
    </div>
  );
}

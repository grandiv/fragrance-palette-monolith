"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import type { Formula, Component } from "@prisma/client";

export default function GeneratePage() {
  const { data: session } = useSession();
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState<
    (Formula & { components: Component[] }) | null
  >(null);

  if (!session) {
    return (
      <div className="p-8">
        <p>You must sign in to generate a formula.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const res = await fetch("/api/formulas/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc }),
    });
    const json = await res.json();
    setResult(json);
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Scent description:
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </label>
        <button type="submit" className="btn">
          Generate Formula
        </button>
      </form>
      {result && (
        <pre className="mt-4 bg-gray-100 p-4">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

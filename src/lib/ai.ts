export type Component = { ingredientId: string; concentration: number };

export interface Formula {
  components: Component[];
}

export async function callLLM(prompt: string): Promise<Formula> {
  const res = await fetch(process.env.LLM_URL! + "/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputs: `Generate fragrance formula for: ${prompt}`,
      parameters: {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.3,
        repetition_penalty: 1.3,
      },
    }),
  });
  if (!res.ok) throw new Error(`LLM error: ${res.status}`);
  const json = await res.json();
  // Expected format: { generated_text: "..." }
  const text = json.generated_text as string;
  // Parse into structured components, e.g. JSON in the text
  try {
    const parsed = JSON.parse(text) as Formula;
    return parsed;
  } catch {
    throw new Error("Failed to parse LLM output");
  }
}

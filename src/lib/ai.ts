import { prisma } from "./prisma";

export interface FormulaResponse {
  fragranceFamilyId: string;
  name: string;
  description: string;
  topNote: string;
  middleNote: string;
  baseNote: string;
  mixing: string;
}

// Keywords to identify fragrance families
const fragranceFamilyKeywords = {
  citrus: [
    "citrus",
    "lemon",
    "orange",
    "bergamot",
    "grapefruit",
    "lime",
    "fresh",
    "zesty",
  ],
  floral: [
    "floral",
    "flower",
    "rose",
    "jasmine",
    "lavender",
    "geranium",
    "ylang",
  ],
  woody: ["wood", "woody", "cedar", "sandalwood", "pine", "forest", "earthy"],
  oriental: ["oriental", "spice", "vanilla", "amber", "cinnamon", "warm"],
  fresh: ["fresh", "aqua", "water", "marine", "green", "mint", "cool"],
};

export async function callLLM(prompt: string): Promise<FormulaResponse> {
  try {
    // Step 1: Identify the fragrance family based on keywords
    const family = await identifyFragranceFamily(prompt);

    // Step 2: Use a simple prompt to generate the three notes
    const notes = await generateNotes(prompt, family);

    // Step 3: Generate a simple mixing instruction and name
    const mixingAndName = await generateMixingAndName(notes, family);

    return {
      fragranceFamilyId: family.id,
      name: mixingAndName.name,
      description: `A ${family.name.toLowerCase()} fragrance with ${
        notes.topNote
      } top notes, ${notes.middleNote} middle notes, and ${
        notes.baseNote
      } base notes.`,
      topNote: notes.topNote,
      middleNote: notes.middleNote,
      baseNote: notes.baseNote,
      mixing: mixingAndName.mixing,
    };
  } catch (error) {
    console.error("Error in callLLM:", error);
    throw error;
  }
}

async function identifyFragranceFamily(prompt: string) {
  // Count keywords for each family in the prompt
  const familyCounts = Object.entries(fragranceFamilyKeywords).map(
    ([family, keywords]) => {
      const count = keywords.reduce(
        (acc, keyword) =>
          acc + (prompt.toLowerCase().includes(keyword) ? 1 : 0),
        0
      );
      return { family, count };
    }
  );

  // Find the family with the most matching keywords
  const topFamily = familyCounts.sort((a, b) => b.count - a.count)[0];

  // If no matching keywords, default to "fresh" family
  const familyName = topFamily.count > 0 ? topFamily.family : "fresh";
  const capitalizedName =
    familyName.charAt(0).toUpperCase() + familyName.slice(1);

  // Get the family from the database
  const family = await prisma.fragranceFamily.findFirst({
    where: { name: capitalizedName },
  });

  if (!family) {
    throw new Error(
      `Fragrance family ${capitalizedName} not found in database`
    );
  }

  return family;
}

async function generateNotes(
  prompt: string,
  family: {
    id: string;
    name: string;
    description: string;
    ingredients: string[];
  }
) {
  // Use simple prompting to generate a top, middle and base note
  const res = await fetch(process.env.LLM_URL! + "/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputs: `For a ${family.name} perfume described as "${prompt}", suggest ONE specific ingredient for each note level:
      
Top note: 
Middle note:
Base note:`,
      parameters: {
        // max_new_tokens: 100,
        temperature: 0.6,
        top_p: 0.3,
        repetition_penalty: 1.3,
      },
    }),
  });

  if (!res.ok) throw new Error(`LLM error: ${res.status}`);

  const json = await res.json();
  const text = json.generated_text as string;
  console.log("Notes response:", text);

  // Extract notes from response
  const topNoteMatch = text.match(/Top note:?\s*([^\n]+)/i);
  const middleNoteMatch = text.match(/Middle note:?\s*([^\n]+)/i);
  const baseNoteMatch = text.match(/Base note:?\s*([^\n]+)/i);

  // Use extracted notes or fallback to ingredients from the family
  const topNote = topNoteMatch ? topNoteMatch[1].trim() : family.ingredients[0];
  const middleNote = middleNoteMatch
    ? middleNoteMatch[1].trim()
    : family.ingredients[Math.min(1, family.ingredients.length - 1)];
  const baseNote = baseNoteMatch
    ? baseNoteMatch[1].trim()
    : family.ingredients[Math.min(2, family.ingredients.length - 1)];

  return { topNote, middleNote, baseNote };
}

async function generateMixingAndName(
  notes: { topNote: string; middleNote: string; baseNote: string },
  family: { name: string }
) {
  // Generate a simple mixing instruction
  const res = await fetch(process.env.LLM_URL! + "/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inputs: `Create a perfume name and simple mixing instruction for a ${family.name} perfume with these notes:
- Top note: ${notes.topNote}
- Middle note: ${notes.middleNote}
- Base note: ${notes.baseNote}

Name: 
Mixing instruction: `,
      parameters: {
        // max_new_tokens: 150,
        temperature: 0.7, // Higher temperature for creative names
        top_p: 0.3,
        repetition_penalty: 1.3,
      },
    }),
  });

  if (!res.ok) throw new Error(`LLM error: ${res.status}`);

  const json = await res.json();
  const text = json.generated_text as string;
  console.log("Name and mixing response:", text);

  // Extract name and mixing instructions
  const nameMatch = text.match(/Name:?\s*([^\n]+)/i);
  const mixingMatch =
    text.match(/Mixing instruction:?\s*([^\n]+)/i) ||
    text.match(/\d+\.\s*([^\n]+)/);

  // Fallbacks if extraction fails
  const name = nameMatch
    ? nameMatch[1].trim()
    : `${notes.topNote} ${family.name} Blend`;
  let mixing = mixingMatch
    ? mixingMatch[1].trim()
    : `Combine 3 drops of ${notes.topNote}, 2 drops of ${notes.middleNote}, and 1 drop of ${notes.baseNote}. Let mature for one week.`;

  // Ensure mixing instruction is complete enough
  if (mixing.length < 30) {
    mixing = `Combine 3 drops of ${notes.topNote}, 2 drops of ${notes.middleNote}, and 1 drop of ${notes.baseNote}. Let mature for one week.`;
  }

  return { name, mixing };
}

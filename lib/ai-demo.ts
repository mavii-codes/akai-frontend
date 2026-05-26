/** Demo assistant reply shown for study-related prompts */
export const PHOTOSYNTHESIS_DEMO = `**Photosynthesis** is how green plants make their own food using sunlight, water, and carbon dioxide.

The overall chemical equation is:
\`6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\`

**In simple terms:**
1. **Light energy** is captured by chlorophyll in the leaves
2. **Carbon dioxide (CO₂)** enters through tiny pores called stomata
3. **Water (H₂O)** is absorbed through the roots
4. The plant produces **glucose (C₆H₁₂O₆)** — its food and energy source
5. **Oxygen (O₂)** is released into the air as a byproduct

This process is essential for life on Earth — plants produce the oxygen we breathe and form the base of most food chains. 🌱`;

export const DEFAULT_FOLLOW_UPS = [
  "Make it even simpler",
  "Give real life example",
  "Create a diagram",
  "Quiz me on this",
];

export const QUICK_ACTION_PROMPTS: Record<string, string> = {
  "Explain Topic": "Explain this topic in simple terms with examples:",
  "Solve Problem": "Help me solve this step by step:",
  Summarize: "Summarize the key points of:",
  "Generate Notes": "Create organized study notes for:",
};

export const STUDY_TOOL_PROMPTS: Record<string, string> = {
  "Flashcards Generator": "Create flashcards for this topic:",
  "Quiz Generator": "Generate a short quiz with answers for:",
  "Mind Map Creator": "Outline a mind map structure for:",
  "Essay Helper": "Help me outline an essay about:",
};

export const RECENT_CONVERSATIONS_SEED = [
  { id: "1", title: "Photosynthesis explanation", ago: "2h ago" },
  { id: "2", title: "Newton's Laws of Motion", ago: "Yesterday" },
  { id: "3", title: "Math exam study plan", ago: "3 days ago" },
];

export function buildDemoReply(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("photo") || lower.includes("plant")) {
    return PHOTOSYNTHESIS_DEMO;
  }
  if (lower.includes("newton") || lower.includes("motion")) {
    return `**Newton's Laws of Motion** describe how objects move when forces act on them.

**First Law (Inertia):** An object stays at rest or in uniform motion unless a net force acts on it.

**Second Law:** Force equals mass times acceleration — **F = ma**.

**Third Law:** For every action, there is an equal and opposite reaction.

These laws explain everything from a book on a table to rockets launching into space.`;
  }
  return `I'd be happy to help with **"${userText}"**.

Here are a few ways we can work on this together:
1. Break the topic into smaller, easier parts
2. Use real-world examples you can remember
3. Create practice questions to test your understanding

What would you like to focus on first?`;
}

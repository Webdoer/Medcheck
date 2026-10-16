// Client-side normalisation mirror of backend normalise.py
// Used to highlight look-alike characters in the ConfirmForm.

const LOOKALIKE_MAP: Record<string, string[]> = {
  O: ["0"],
  "0": ["O"],
  I: ["1", "L", "l"],
  "1": ["I", "L", "l"],
  S: ["5"],
  "5": ["S"],
  B: ["8"],
  "8": ["B"],
};

export function normalise(text: string): string {
  return text
    .toUpperCase()
    .replace(/[\s\-_.]+/g, "")
    .split("")
    .map((ch) => {
      // Map look-alikes
      for (const [norm, alikes] of Object.entries(LOOKALIKE_MAP)) {
        if (alikes.includes(ch)) return norm;
      }
      return ch;
    })
    .join("");
}

/**
 * Return character positions in `value` that contain look-alike characters.
 * Used to highlight fields in the confirm form.
 */
export function findLookalikePositions(value: string): number[] {
  const ambiguous = new Set(["0", "O", "1", "I", "L", "l", "5", "S", "8", "B"]);
  return value
    .split("")
    .map((ch, i) => (ambiguous.has(ch) ? i : -1))
    .filter((i) => i !== -1);
}

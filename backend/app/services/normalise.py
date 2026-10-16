"""
Normalisation helpers for batch numbers, drug names, and manufacturer names.

Rules:
  - uppercase
  - strip whitespace, hyphens, dots, underscores
  - map look-alike characters: 0→O, 1→I, 5→S, 8→B, l→I
"""
import re

# Look-alike character map (applied AFTER uppercasing)
_LOOKALIKE: dict[str, str] = {
    "0": "O",
    "1": "I",
    "5": "S",
    "8": "B",
    "L": "I",   # uppercase L already, just map
}

_STRIP_PATTERN = re.compile(r"[\s\-_\.]+")


def normalise(text: str) -> str:
    """Normalise a string for fuzzy comparison."""
    if not text:
        return ""
    s = text.upper()
    s = _STRIP_PATTERN.sub("", s)
    result = []
    for ch in s:
        result.append(_LOOKALIKE.get(ch, ch))
    return "".join(result)


def diff_chars(user_val: str, flagged_val: str) -> list[dict]:
    """
    Return positions where normalised user_val differs from normalised flagged_val.
    Used by the POSSIBLE_MATCH response to highlight differing characters.
    """
    u = user_val.upper()
    f = flagged_val.upper()
    diffs = []
    for i, (uc, fc) in enumerate(zip(u, f)):
        if uc != fc:
            diffs.append({"position": i, "user_char": uc, "flagged_char": fc})
    if len(u) != len(f):
        for i in range(min(len(u), len(f)), max(len(u), len(f))):
            uc = u[i] if i < len(u) else ""
            fc = f[i] if i < len(f) else ""
            diffs.append({"position": i, "user_char": uc, "flagged_char": fc})
    return diffs


def make_dedup_key(drug_name: str, batch: str, manufacturer: str | None) -> str:
    """Create a stable deduplication key for a row."""
    parts = [normalise(drug_name), normalise(batch), normalise(manufacturer or "")]
    return "|".join(parts)

"""
Banned words check (safety rule §1).

Scans all i18n JSON files and the fuzzy_search service for the words
"safe" and "genuine" and fails if they appear outside the approved NOT_FOUND sentence.
"""
import json
import os
import re
import glob

# The only approved sentence that may contain "safe" (as a word within the disclaimer)
APPROVED_NOT_FOUND_EN = (
    "This batch is not in the flagged list we have. "
    "This does not guarantee it is safe. "
    "Check the pack, buy from licensed shops."
)

# Words that must never appear in any standalone context
BANNED_WORDS = ["safe", "genuine"]

# i18n keys where these words are explicitly forbidden (all result/status keys)
FORBIDDEN_KEYS = [
    "result_ok", "result_match", "result_possible",
    "not_found_message", "match_found_message",
]

I18N_DIR = os.path.join(
    os.path.dirname(__file__), "..", "..", "frontend", "src", "i18n"
)


def test_i18n_no_banned_words_in_forbidden_keys():
    """
    Scan every i18n JSON file. Values for forbidden keys must not contain
    'safe' or 'genuine' as standalone words.
    """
    pattern = re.compile(r"\b(safe|genuine)\b", re.IGNORECASE)
    i18n_path = os.path.abspath(I18N_DIR)
    json_files = glob.glob(os.path.join(i18n_path, "*.json"))

    assert json_files, f"No i18n JSON files found at {i18n_path}"

    violations = []
    for filepath in json_files:
        with open(filepath, encoding="utf-8") as f:
            data = json.load(f)
        for key, value in data.items():
            if key in FORBIDDEN_KEYS and isinstance(value, str):
                if pattern.search(value):
                    violations.append(f"{os.path.basename(filepath)}[{key!r}]: {value!r}")

    assert not violations, (
        "Found 'safe' or 'genuine' in forbidden i18n keys:\n"
        + "\n".join(violations)
        + "\n\nFix: change result_ok text to not imply safety."
    )


def test_i18n_result_ok_no_safe():
    """
    The 'result_ok' key specifically must not contain the word 'safe'.
    Formerly it read 'This batch looks safe' — that is banned.
    """
    pattern = re.compile(r"\bsafe\b", re.IGNORECASE)
    i18n_path = os.path.abspath(I18N_DIR)
    json_files = glob.glob(os.path.join(i18n_path, "*.json"))

    for filepath in json_files:
        with open(filepath, encoding="utf-8") as f:
            data = json.load(f)
        value = data.get("result_ok", "")
        if isinstance(value, str) and pattern.search(value):
            fname = os.path.basename(filepath)
            assert False, (
                f"i18n/{fname} result_ok contains 'safe': {value!r}\n"
                f"Change to: 'Not found in flagged list' or similar (no safety claim)."
            )


def test_fuzzy_search_not_found_message_exact():
    """
    The English NOT_FOUND message must match the approved wording exactly.
    """
    from app.services.fuzzy_search import _NOT_FOUND_EN
    assert _NOT_FOUND_EN == (
        "This batch is not in the flagged list we have. "
        "This does not guarantee it is safe. "
        "Check the pack, buy from licensed shops."
    ), f"NOT_FOUND_EN has drifted from approved wording: {_NOT_FOUND_EN!r}"


def test_fuzzy_search_messages_no_standalone_genuine():
    """No message may claim a drug is 'genuine'."""
    from app.services.fuzzy_search import _MESSAGES
    pattern = re.compile(r"\bgenuine\b", re.IGNORECASE)
    violations = []
    for status, lang_map in _MESSAGES.items():
        for lang, msg in lang_map.items():
            if pattern.search(msg):
                violations.append(f"_MESSAGES[{status!r}][{lang!r}]: {msg!r}")
    assert not violations, "Found 'genuine' in fuzzy_search messages:\n" + "\n".join(violations)


def test_fuzzy_search_match_found_no_safe():
    """MATCH_FOUND messages must not say 'safe'."""
    from app.services.fuzzy_search import _MESSAGES
    pattern = re.compile(r"\bsafe\b", re.IGNORECASE)
    for lang, msg in _MESSAGES.get("MATCH_FOUND", {}).items():
        assert not pattern.search(msg), (
            f"MATCH_FOUND[{lang}] contains 'safe': {msg!r}"
        )

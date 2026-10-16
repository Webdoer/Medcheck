"""
Tests for normalisation (safety rule §6 + all spec requirements).

Covers: 0/O, 1/I/l, 5/S, 8/B substitutions, spaces, hyphens,
case folding, and make_dedup_key.
"""
import pytest
from app.services.normalise import normalise, diff_chars, make_dedup_key


class TestNormalise:
    def test_uppercase(self):
        assert normalise("abcdef") == "ABCDEF"

    def test_zero_to_O(self):
        assert normalise("B0001") == "BOOOI"

    def test_one_to_I(self):
        assert normalise("B1001") == "BIOOI"

    def test_five_to_S(self):
        assert normalise("B5001") == "BSOOI"

    def test_eight_to_B(self):
        assert normalise("B8001") == "BBOOI"

    def test_l_to_I(self):
        # lowercase l → uppercase L → I
        assert "I" in normalise("Bl001")

    def test_strip_spaces(self):
        # 0 in "2024" → O; 0 in "001" → O; 1 → I  ∴ B2O24OOI
        assert normalise("B 2024 001") == "B2O24OOI"

    def test_strip_hyphens(self):
        assert normalise("B-2024-001") == "B2O24OOI"

    def test_strip_dots(self):
        assert normalise("B.2024.001") == "B2O24OOI"

    def test_strip_underscores(self):
        assert normalise("B_2024_001") == "B2O24OOI"

    def test_combined(self):
        # "B0 - l 5" → uppercase → "B0 - L 5" → strip → "B0L5" → lookalike → "BOIS"
        result = normalise("B0 - l 5")
        assert result == "BOIS"

    def test_empty(self):
        assert normalise("") == ""

    def test_none_equivalent(self):
        assert normalise("   ") == ""

    def test_exact_match_after_normalise(self):
        # "B2024-DEMO-001" and "B2024 DEMO 001" should normalise to same value
        a = normalise("B2024-DEMO-001")
        b = normalise("B2024 DEMO 001")
        assert a == b

    def test_lookalike_0_O(self):
        # user types 0, database has O — both normalise to O
        user = normalise("B2024-DEM0-001")    # zero
        db   = normalise("B2024-DEMO-001")   # letter O
        assert user == db

    def test_lookalike_1_I(self):
        user = normalise("BATCH1NUMBER")
        db   = normalise("BATCBINUMBER")  # wrong but tests I substitution
        # At least confirm 1 → I
        assert normalise("B1TCH") == normalise("BITCH".replace("I", "I"))  # I stays I

    def test_lookalike_all_four(self):
        # 0→O, 1→I, 5→S, 8→B
        result = normalise("0158")
        assert result == "OISB"


class TestDiffChars:
    def test_no_diff(self):
        diffs = diff_chars("ABC", "ABC")
        assert diffs == []

    def test_single_diff(self):
        diffs = diff_chars("A0C", "AOC")
        # Position 1: user='0', flagged='O'
        assert any(d["position"] == 1 for d in diffs)

    def test_length_diff_shorter(self):
        diffs = diff_chars("AB", "ABC")
        # Position 2: user='', flagged='C'
        assert any(d["position"] == 2 for d in diffs)

    def test_length_diff_longer(self):
        diffs = diff_chars("ABCD", "ABC")
        # Position 3: user='D', flagged=''
        assert any(d["position"] == 3 for d in diffs)


class TestMakeDedupKey:
    def test_basic(self):
        key = make_dedup_key("Drug A", "B-001", "Manuf")
        assert "|" in key
        assert len(key) > 0

    def test_idempotent(self):
        k1 = make_dedup_key("Drug A", "B-001", "Manuf")
        k2 = make_dedup_key("Drug A", "B-001", "Manuf")
        assert k1 == k2

    def test_normalises_key(self):
        # Same logical entry, different formatting → same dedup key
        k1 = make_dedup_key("DRUG A", "B-001", "MANUF")
        k2 = make_dedup_key("drug a", "b 001", "manuf")
        assert k1 == k2

    def test_none_manufacturer(self):
        key = make_dedup_key("Drug", "B001", None)
        assert key is not None

    def test_different_drugs_different_keys(self):
        k1 = make_dedup_key("Drug A", "B001", "M")
        k2 = make_dedup_key("Drug B", "B001", "M")
        assert k1 != k2

    def test_different_batches_different_keys(self):
        k1 = make_dedup_key("Drug", "B001", "M")
        k2 = make_dedup_key("Drug", "B002", "M")
        assert k1 != k2

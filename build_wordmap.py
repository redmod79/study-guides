#!/usr/bin/env python3
"""
build_wordmap.py — Build a transliterated-word → Strong's number mapping.

Reads strongs.json (13,772 entries), strips diacritics from each
transliteration, and outputs docs/javascripts/wordmap.json — a compact
lookup table so the verse-popup.js can link italic Hebrew/Greek words
without needing an explicit (H1234) pairing on the page.
"""

import json
import unicodedata
import re
from pathlib import Path

STRONGS_PATH = Path("D:/bible/study-guides-website/docs/javascripts/strongs.json")
OUTPUT_PATH = Path("D:/bible/study-guides-website/docs/javascripts/wordmap.json")


def strip_diacritics(s: str) -> str:
    nfkd = unicodedata.normalize("NFKD", s)
    stripped = "".join(c for c in nfkd if not unicodedata.combining(c))
    # Remove alef/ayin markers and smart quotes
    for ch in ("ʼ", "ʻ", "‘", "’", "'"):
        stripped = stripped.replace(ch, "")
    return stripped.lower().strip()


def build_wordmap():
    with open(STRONGS_PATH, encoding="utf-8") as f:
        data = json.load(f)

    word_map: dict[str, str] = {}
    collisions = 0

    for num, entry in sorted(data.items()):
        translit = entry.get("translit", "")
        if not translit:
            continue

        simplified = strip_diacritics(translit)
        if len(simplified) < 2:
            continue

        # Skip entries that are just numbers or punctuation
        if not re.search(r"[a-z]", simplified):
            continue

        if simplified not in word_map:
            word_map[simplified] = num
        else:
            collisions += 1

    # Add common simplified aliases used in study guides
    aliases = {
        # Hebrew — uw/ow → u/o, drop w in vowel clusters
        "ruach": "H7307", "olam": "H5769", "sheol": "H7585",
        "olah": "H5930", "chesed": "H2617", "shalom": "H7965",
        "torah": "H8451", "tselem": "H6754", "kabod": "H3519",
        "yom": "H3117", "tsedaqah": "H6666", "teshubah": "H8666",
        "mishpat": "H4941", "berith": "H1285", "chuqqah": "H2708",
        "dabar": "H1697", "emunah": "H530", "galah": "H1540",
        "abad": "H6", "shamayim": "H8064", "eretz": "H776",
        "natsach": "H5329", "qadosh": "H6918", "shabbath": "H7676",
        "pacach": "H6452", "chagag": "H2287", "karath": "H3772",
        "eshtonot": "H6250", "mut": "H4191", "chayyah": "H2416",
        "nephesh meth": "H5315", "bayom hahu": "H3117",
        # Greek — common study-guide spellings
        "hades": "G86", "gehenna": "G1067", "tartaroo": "G5020",
        "odunao": "G3600", "apolleia": "G684",
        "apollymi": "G622", "apoleia": "G684",
        "paradeisos": "G3857", "parousia": "G3952",
        "ekklesia": "G1577", "euangelion": "G2098",
        "logos": "G3056", "agape": "G26", "eirene": "G1515",
        "hamartia": "G266", "metanoia": "G3341",
        "sozo": "G4982", "soteria": "G4991",
        "dikaios": "G1342", "krisis": "G2920", "krima": "G2917",
        "zoe": "G2222", "anastasis": "G386",
        "sarx": "G4561", "soma": "G4983",
        "doxa": "G1391", "dunamis": "G1411",
        "aletheia": "G225", "marturia": "G3141",
        "theos": "G2316", "christos": "G5547", "kyrios": "G2962",
        "ergon": "G2041", "plerooma": "G4138",
        "katakaio": "G2618", "brygmos": "G1030",
        "skorpios": "G4651", "phthartos": "G5349",
        "horama": "G3705", "anapauomai": "G373",
        "scriptio continua": "G3588",  # skip, not a real word
        "enduo": "G1746", "monos": "G3441",
        "semeron": "G4594", "ov": "H178",
        "mashal": "H4912", "rephaim": "H7496",
        "imago dei": "H6754",
    }
    # Remove non-word entries
    aliases.pop("scriptio continua", None)
    aliases.pop("imago dei", None)
    aliases.pop("bayom hahu", None)
    aliases.pop("nephesh meth", None)

    for alias, num in aliases.items():
        if alias not in word_map:
            word_map[alias] = num

    # Write compact JSON (no pretty-printing — it's a lookup table)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(word_map, f, separators=(",", ":"), ensure_ascii=True)

    print(f"Strong's entries:   {len(data)}")
    print(f"Mapped words:       {len(word_map)}")
    print(f"Collisions skipped: {collisions}")
    print(f"Output:             {OUTPUT_PATH}")
    print(f"File size:          {OUTPUT_PATH.stat().st_size:,} bytes")

    # Spot-check common study guide terms
    print("\nSpot checks:")
    tests = [
        "nephesh", "ruach", "neshamah", "pneuma", "pnoe", "psyche",
        "thanatos", "athanasia", "aphtharsia", "aphthartos", "thnetos",
        "basanizo", "basanos", "basanismos", "odunao",
        "aionios", "aion", "aidios", "olam",
        "sheol", "hades", "gehenna", "geenna",
        "apollymi", "apolleia", "phthora",
        "chuwl", "machowl", "karar", "raqad",
        "koimao", "parabole", "kolpos",
        "elohiym", "maveth", "muwth", "hayah",
        "qodesh", "nomos", "entole", "torah",
        "pistis", "charis", "dikaiosyne",
    ]
    for word in tests:
        num = word_map.get(word, "—")
        print(f"  {word:<20} {num}")


if __name__ == "__main__":
    build_wordmap()

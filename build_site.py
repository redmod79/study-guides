#!/usr/bin/env python3
"""
build_site.py — Build the Bible Study Guides website.

A generic study-guides host. Each series lives under its own
docs/series/<key>/ directory. Currently hosts:

  - etc: The Final Fate of the Wicked (20 guides)

To add a new series, add an entry to SERIES and define its
studies/tiers in a new _build_<key>() helper or in SERIES metadata.
"""

import shutil
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent
BIBLE_STUDIES = Path("D:/bible/bible-studies")
ETC_WEBSITE = Path("D:/bible/etc-website")
HIST_WEBSITE = Path("D:/bible/hist-website")
DOCS = PROJECT_ROOT / "docs"

GUIDE_FILES = [
    ("beginner-questions.md", "Beginner Questions"),
    ("beginner-answers.md", "Beginner Answers"),
    ("advanced-questions.md", "Advanced Questions"),
    ("advanced-answers.md", "Advanced Answers"),
]

# ── Series registry ───────────────────────────────────────────────
SERIES = {
    "etc": {
        "title": "The Final Fate of the Wicked",
        "subtitle": "Death, the Soul, Immortality, and the Fate of the Wicked",
        "source_dir": BIBLE_STUDIES / "etc6-study-guides",
        "source_research": "https://redmod79.github.io/etc-website/",
        "studies": {
            "01": {"folder": "01-what-is-man", "title": "What Is Man?", "question": "What is a soul? What is a spirit? How was man created?"},
            "02": {"folder": "02-who-has-immortality", "title": "Who Has Immortality?", "question": "Does anyone besides God possess immortality?"},
            "03": {"folder": "03-what-does-death-mean", "title": "What Does Death Mean?", "question": "What does 'death' mean in the Bible?"},
            "04": {"folder": "04-state-of-the-dead", "title": "State of the Dead", "question": "Are the dead conscious or unconscious?"},
            "05": {"folder": "05-four-hell-words", "title": "Four Hell Words", "question": "Sheol, Hades, Gehenna, Tartaroo — what do they mean?"},
            "06": {"folder": "06-destruction-vocabulary", "title": "Destruction Vocabulary", "question": "What words does the Bible use for the fate of the wicked?"},
            "07": {"folder": "07-forever-in-ot", "title": "Forever in the OT", "question": "Does the Hebrew word olam always mean 'eternal'?"},
            "08": {"folder": "08-forever-in-nt", "title": "Forever in the NT", "question": "Does the Greek word aionios always mean 'eternal'?"},
            "09": {"folder": "09-rich-man-and-lazarus", "title": "Rich Man and Lazarus", "question": "Is the Rich Man and Lazarus a parable or literal?"},
            "10": {"folder": "10-souls-under-the-altar", "title": "Souls Under the Altar", "question": "What does Revelation 6:9-11 teach about the dead?"},
            "11": {"folder": "11-smoke-ascending-forever", "title": "Smoke Ascending Forever", "question": "What does 'smoke ascending forever' mean? (Rev 14, 19)"},
            "12": {"folder": "12-tormented-forever", "title": "Tormented Forever", "question": "Who is 'tormented forever' in Rev 20:10?"},
            "13": {"folder": "13-lake-of-fire-second-death", "title": "Lake of Fire & Second Death", "question": "What is the lake of fire? What is the second death?"},
            "14": {"folder": "14-judgment-passages", "title": "Judgment Passages", "question": "Eight major judgment texts examined"},
            "15": {"folder": "15-ect-strongest-case", "title": "ECT's Strongest Case", "question": "The best arguments for eternal torment, evaluated"},
            "16": {"folder": "16-historical-origins-of-ect", "title": "Historical Origins of ECT", "question": "How did the doctrine of eternal torment enter Christianity?"},
            "17": {"folder": "17-gods-character-and-justice", "title": "God's Character and Justice", "question": "Is infinite torment consistent with God's character?"},
            "18": {"folder": "18-matthew-10-28", "title": "Matthew 10:28", "question": "'Destroy both soul and body in hell' — what does Jesus mean?"},
            "19": {"folder": "19-judgment-parables", "title": "Judgment Parables", "question": "What do Jesus' judgment parables teach?"},
            "20": {"folder": "20-series-review", "title": "Series Review", "question": "Comprehensive review of all 19 studies"},
        },
        "tiers": [
            {"name": "Foundation (Studies 1-4)", "desc": "What is a soul? What is a spirit? Does anyone have immortality? What happens at death?", "studies": ["01", "02", "03", "04"]},
            {"name": "Key Words (Studies 5-8)", "desc": "The Hebrew and Greek vocabulary for hell, destruction, and 'forever' — examined word by word.", "studies": ["05", "06", "07", "08"]},
            {"name": "Difficult Passages (Studies 9-13)", "desc": "The passages most often cited in support of eternal torment — each examined in full context.", "studies": ["09", "10", "11", "12", "13"]},
            {"name": "Evaluation (Studies 14-19)", "desc": "Judgment passages, the strongest case for ECT, historical origins, God's character, and Jesus' parables.", "studies": ["14", "15", "16", "17", "18", "19"]},
            {"name": "Review", "desc": "A comprehensive review of all 19 studies.", "studies": ["20"]},
        ],
    },
}


def copy_series_guides(key: str, series: dict) -> int:
    """Copy study guide files for one series into docs/series/<key>/."""
    src_dir = series["source_dir"]
    dest_dir = DOCS / "series" / key

    if dest_dir.exists():
        shutil.rmtree(dest_dir)
    dest_dir.mkdir(parents=True)

    # Copy series README as index
    readme = src_dir / "README.md"
    if readme.exists():
        shutil.copy2(readme, dest_dir / "how-to-use.md")

    copied = 0
    for num, meta in sorted(series["studies"].items()):
        src = src_dir / meta["folder"]
        if not src.exists():
            print(f"    WARNING: {src} not found, skipping")
            continue

        dest = dest_dir / meta["folder"]
        dest.mkdir(parents=True, exist_ok=True)

        for fname, _ in GUIDE_FILES:
            src_file = src / fname
            if src_file.exists():
                shutil.copy2(src_file, dest / fname)

        copied += 1
        print(f"    {num}: {meta['folder']}")

    return copied


def build_series_nav(key: str, series: dict) -> list:
    """Build the mkdocs nav entries for one series."""
    nav = []
    how_to = DOCS / "series" / key / "how-to-use.md"
    if how_to.exists():
        nav.append({"How to Use This Series": f"series/{key}/how-to-use.md"})
    for tier in series["tiers"]:
        tier_items = []
        for num in tier["studies"]:
            meta = series["studies"][num]
            folder = meta["folder"]
            dest = DOCS / "series" / key / folder
            study_items = []
            for fname, label in GUIDE_FILES:
                if (dest / fname).exists():
                    study_items.append({label: f"series/{key}/{folder}/{fname}"})
            if study_items:
                tier_items.append({f"{num} -- {meta['title']}": study_items})
        if tier_items:
            nav.append({tier["name"]: tier_items})
    return nav


def build_series_index_md(key: str, series: dict) -> str:
    """Build the index page content for one series."""
    lines = []
    lines.append(f"# {series['title']}")
    lines.append("")
    lines.append(f"*{series['subtitle']}*")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Two Levels")
    lines.append("")
    lines.append("Each study has two levels:")
    lines.append("")
    lines.append("- **Beginner** — Read Scripture and observe what the text says. No prior knowledge of Hebrew, Greek, or theology needed.")
    lines.append("- **Advanced** — Original-language word studies, cross-referencing, counter-arguments, and evidence classification exercises.")
    lines.append("")
    lines.append("Each level has a **Questions** page (for self-study) and an **Answers** page (full answer key with verse quotes).")
    lines.append("")
    lines.append(f'[**How to Use This Series**](series/{key}/how-to-use.md){{ .md-button }}')
    lines.append("")
    lines.append("---")
    lines.append("")

    for tier in series["tiers"]:
        lines.append(f"### {tier['name']}")
        lines.append("")
        lines.append(tier["desc"])
        lines.append("")
        lines.append("| # | Study | Topic |")
        lines.append("|---|-------|-------|")
        for num in tier["studies"]:
            meta = series["studies"][num]
            link = f"series/{key}/{meta['folder']}/beginner-questions.md"
            lines.append(f"| {num} | [{meta['title']}]({link}) | {meta['question']} |")
        lines.append("")

    if series.get("source_research"):
        lines.append("---")
        lines.append("")
        lines.append("## Source Research")
        lines.append("")
        lines.append(f"These study guides are derived from the [{series['title']}]({series['source_research']}) research series — a full investigation using tool-driven, sola scriptura methodology with complete evidence tables, word studies, and cross-references.")
        lines.append("")

    return "\n".join(lines) + "\n"


def generate_mkdocs_yml():
    """Generate mkdocs.yml with all series."""
    lines = []
    lines.append('site_name: "Bible Study Guides"')
    lines.append('site_url: "https://redmod79.github.io/study-guides/"')
    lines.append('site_description: "Interactive Bible study guides with beginner and advanced levels. Teaches the skill of distinguishing explicit biblical statements from inference."')
    lines.append("")
    lines.append("theme:")
    lines.append("  name: material")
    lines.append("  palette:")
    lines.append("    - scheme: default")
    lines.append("      primary: deep purple")
    lines.append("      accent: amber")
    lines.append("      toggle:")
    lines.append("        icon: material/brightness-7")
    lines.append("        name: Switch to dark mode")
    lines.append("    - scheme: slate")
    lines.append("      primary: deep purple")
    lines.append("      accent: amber")
    lines.append("      toggle:")
    lines.append("        icon: material/brightness-4")
    lines.append("        name: Switch to light mode")
    lines.append("  features:")
    lines.append("    - navigation.instant")
    lines.append("    - navigation.tracking")
    lines.append("    - navigation.tabs")
    lines.append("    - navigation.sections")
    lines.append("    - navigation.top")
    lines.append("    - navigation.indexes")
    lines.append("    - search.suggest")
    lines.append("    - search.highlight")
    lines.append("    - content.tabs.link")
    lines.append("    - toc.follow")
    lines.append("  font:")
    lines.append("    text: Roboto")
    lines.append("    code: Roboto Mono")
    lines.append("  custom_dir: overrides")
    lines.append("")
    lines.append("plugins:")
    lines.append("  - search")
    lines.append("")
    lines.append("markdown_extensions:")
    lines.append("  - abbr")
    lines.append("  - admonition")
    lines.append("  - attr_list")
    lines.append("  - def_list")
    lines.append("  - footnotes")
    lines.append("  - md_in_html")
    lines.append("  - tables")
    lines.append("  - toc:")
    lines.append("      permalink: true")
    lines.append("  - pymdownx.details")
    lines.append("  - pymdownx.superfences")
    lines.append("  - pymdownx.highlight:")
    lines.append("      anchor_linenums: true")
    lines.append("  - pymdownx.inlinehilite")
    lines.append("  - pymdownx.tabbed:")
    lines.append("      alternate_style: true")
    lines.append("  - pymdownx.tasklist:")
    lines.append("      custom_checkbox: true")
    lines.append("")
    lines.append("extra:")
    lines.append("  social:")
    lines.append("    - icon: fontawesome/solid/book-bible")
    lines.append("      link: /")
    lines.append("")
    lines.append("extra_javascript:")
    lines.append("  - javascripts/verse-popup.js")
    lines.append("  - javascripts/external-links.js")
    lines.append("")
    lines.append("extra_css:")
    lines.append("  - stylesheets/extra.css")
    lines.append("")
    lines.append("nav:")
    lines.append("  - Home: index.md")

    for key, series in SERIES.items():
        series_nav = build_series_nav(key, series)
        lines.append(f'  - "{series["title"]}":')
        for tier_entry in series_nav:
            for tier_name, tier_value in tier_entry.items():
                if isinstance(tier_value, str):
                    lines.append(f'    - "{tier_name}": {tier_value}')
                else:
                    lines.append(f'    - "{tier_name}":')
                    for study_entry in tier_value:
                        for study_title, study_items in study_entry.items():
                            lines.append(f'      - "{study_title}":')
                            for item in study_items:
                                for label, path in item.items():
                                    lines.append(f'        - "{label}": {path}')
        lines.append("")

    yml_path = PROJECT_ROOT / "mkdocs.yml"
    yml_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  Generated {yml_path}")


def generate_index_md():
    """Generate docs/index.md — landing page listing all series."""
    lines = []
    lines.append("# Bible Study Guides")
    lines.append("")
    lines.append("*Interactive Bible study guides with beginner and advanced levels. Each study teaches the critical skill of distinguishing between what the Bible **explicitly says** and what people **infer** from the Bible.*")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## The Core Skill: Explicit vs. Inference")
    lines.append("")
    lines.append("- **Explicit** — You can point to a verse and quote it. The text directly says this.")
    lines.append("- **Necessary Implication** — No single verse says this word-for-word, but it unavoidably follows from what the text does say.")
    lines.append("- **Inference** — Someone claims the Bible teaches this, but no verse says it and no combination of verses forces it. Something must be *added* beyond what the text contains.")
    lines.append("")
    lines.append("**Hierarchy:** Explicit > Necessary Implication > Inference")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Available Series")
    lines.append("")

    for key, series in SERIES.items():
        count = len(series["studies"])
        lines.append(f"### {series['title']} -- {count} Studies")
        lines.append("")
        lines.append(f"*{series['subtitle']}*")
        lines.append("")
        lines.append("| # | Study | Topic |")
        lines.append("|---|-------|-------|")
        for num, meta in sorted(series["studies"].items()):
            link = f"series/{key}/{meta['folder']}/beginner-questions.md"
            lines.append(f"| {num} | [{meta['title']}]({link}) | {meta['question']} |")
        lines.append("")
        if series.get("source_research"):
            lines.append(f"*Based on the [{series['title']}]({series['source_research']}) research series.*")
            lines.append("")
        lines.append("---")
        lines.append("")

    (DOCS / "index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  Generated index.md")


def copy_assets():
    """Copy shared assets from etc-website."""
    js_src = ETC_WEBSITE / "docs" / "javascripts"
    js_dest = DOCS / "javascripts"
    js_dest.mkdir(parents=True, exist_ok=True)
    for fname in ["external-links.js", "verses.json", "strongs.json"]:
        src = js_src / fname
        if src.exists():
            shutil.copy2(src, js_dest / fname)
            print(f"  Copied {fname}")

    css_src = ETC_WEBSITE / "docs" / "stylesheets" / "extra.css"
    css_dest = DOCS / "stylesheets"
    css_dest.mkdir(parents=True, exist_ok=True)
    if css_src.exists():
        shutil.copy2(css_src, css_dest / "extra.css")
        print(f"  Copied extra.css")


def copy_overrides():
    """Copy overrides from hist-website."""
    src = HIST_WEBSITE / "overrides" / "main.html"
    dest = PROJECT_ROOT / "overrides"
    dest.mkdir(parents=True, exist_ok=True)
    if src.exists():
        shutil.copy2(src, dest / "main.html")
        print(f"  Copied overrides/main.html")


def generate_supporting_files():
    """Generate .gitignore and README.md."""
    (PROJECT_ROOT / ".gitignore").write_text("site/\n.venv/\n__pycache__/\nnode_modules/\n", encoding="utf-8")

    lines = ["# Bible Study Guides", ""]
    lines.append("Interactive Bible study guides with beginner and advanced levels.")
    lines.append("")
    lines.append("## Series")
    lines.append("")
    for key, series in SERIES.items():
        lines.append(f"### {series['title']} ({len(series['studies'])} studies)")
        lines.append("")
        lines.append(f"*{series['subtitle']}*")
        lines.append("")
    lines.append("## Built With")
    lines.append("")
    lines.append("- [MkDocs](https://www.mkdocs.org/) with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)")
    lines.append("- Interactive Bible verse popups")
    (PROJECT_ROOT / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"  Generated .gitignore and README.md")


def main():
    print("=" * 60)
    print("Building Bible Study Guides website")
    print("=" * 60)

    total = 0
    for key, series in SERIES.items():
        print(f"\n[Series: {key}] Copying {series['title']}...")
        count = copy_series_guides(key, series)
        print(f"  Copied {count} studies")
        total += count

    print(f"\n[Assets] Copying shared assets...")
    copy_assets()

    print(f"\n[Overrides] Copying overrides...")
    copy_overrides()

    print(f"\n[Wordmap] Building word map...")
    wordmap_script = PROJECT_ROOT / "build_wordmap.py"
    if wordmap_script.exists():
        import subprocess, sys
        subprocess.run([sys.executable, str(wordmap_script)], cwd=PROJECT_ROOT)

    print(f"\n[Config] Generating mkdocs.yml...")
    generate_mkdocs_yml()

    print(f"\n[Content] Generating index.md...")
    generate_index_md()

    print(f"\n[Files] Generating supporting files...")
    generate_supporting_files()

    print(f"\n{'=' * 60}")
    print("Build complete!")
    print(f"  Series: {len(SERIES)}")
    print(f"  Total guides: {total}")
    print(f"  Output: {DOCS}")
    print(f"\nNext steps:")
    print(f"  1. cd study-guides-website && mkdocs serve")
    print(f"  2. python D:/bible/deploy_all.py study-guides")
    print("=" * 60)


if __name__ == "__main__":
    main()

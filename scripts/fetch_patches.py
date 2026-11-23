import json, re, hashlib
from datetime import datetime, timezone
from pathlib import Path
import requests
from bs4 import BeautifulSoup

URL = "https://support.rockstargames.com/articles/sN5pEdFYZdlvijKXd6xpJ/grand-theft-auto-vi-launch-updates-ps5-xbox-series-x-or-s"
OUT = Path("public/patches.json")
MONTHS = r"January|February|March|April|May|June|July|August|September|October|November|December"
HEADER = re.compile(rf"^\[\s*({MONTHS}\s+\d{{1,2}},\s+\d{{4}})\s*\]\s*(?:[-–—]\s*(.*))?$", re.I)
DATE_INLINE = re.compile(rf"\[\s*({MONTHS}\s+\d{{1,2}},\s+\d{{4}})\s*\]", re.I)

def clean_lines(text):
    lines = []
    for raw in text.splitlines():
        line = re.sub(r"\s+", " ", raw).strip()
        if line and line not in lines:
            lines.append(line)
    return lines

def main():
    response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0 GTA6PatchTracker/1.0"}, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    main = soup.find("main") or soup
    text = main.get_text("\n", strip=True)
    lines = clean_lines(text)

    # Keep only the article section if the page includes navigation or recommendations.
    start = next((i for i, line in enumerate(lines) if "Grand Theft Auto VI Launch Updates" in line), 0)
    lines = lines[start:]

    existing = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {"patches": []}
    old = existing.get("patches", [])
    found = []

    i = 0
    while i < len(lines):
        line = lines[i]
        match = HEADER.match(line)
        if not match:
            # Rockstar sometimes places date and category on the same line with surrounding text.
            inline = DATE_INLINE.search(line)
            if inline:
                date = inline.group(1)
                category = line[inline.end():].strip(" -–—")
            else:
                i += 1
                continue
        else:
            date, category = match.group(1), (match.group(2) or "").strip()

        i += 1
        section = []
        while i < len(lines) and not HEADER.match(lines[i]) and not DATE_INLINE.search(lines[i]):
            if not lines[i].startswith("Last Updated:") and "Grand Theft Auto VI Launch Updates" not in lines[i]:
                section.append(lines[i].lstrip("•*- ").strip())
            i += 1

        notes = []
        for item in section:
            item = item.strip()
            if not item or item.lower() in {"rockstar games customer support", "was this article helpful?"}:
                continue
            # Avoid saving generic page furniture as patch content.
            if len(item) > 2:
                notes.append(item)

        if not notes:
            continue

        date_obj = datetime.strptime(date, "%B %d, %Y")
        version_match = re.search(r"\bversion\s*([0-9]+(?:\.[0-9]+)+)\b", " ".join(notes), re.I)
        version = f"Versie {version_match.group(1)}" if version_match else ""
        title = category or "GTA VI-update"
        stable = f"{date}|{title}|{'|'.join(notes)}"
        patch_id = hashlib.sha1(stable.encode("utf-8")).hexdigest()[:16]

        found.append({
            "id": patch_id,
            "date": date_obj.strftime("%Y-%m-%d"),
            "title": title,
            "category": title,
            "version": version,
            "notes": notes,
            "url": URL
        })

    # Do not erase the archive if Rockstar's HTML changes or parsing returns nothing.
    if found:
        merged = {p["id"]: p for p in found}
        for p in old:
            merged.setdefault(p["id"], p)
        patches = sorted(merged.values(), key=lambda p: p.get("date", ""), reverse=True)
    else:
        patches = old

    result = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "source": URL,
        "patches": patches
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Scrape klaar. {len(patches)} patch(s) in archief; {len(found)} gevonden op de bronpagina.")

if __name__ == "__main__":
    main()

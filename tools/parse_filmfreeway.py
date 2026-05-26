#!/usr/bin/env python3
"""
FilmFreeway submission parser.

Two modes:
  1. Parse a saved JSON file (offline):
       python parse_filmfreeway.py --file render_my_submissions.json

  2. Fetch live from FilmFreeway using a session cookie (online):
       python parse_filmfreeway.py --cookie "_session=YOUR_COOKIE_VALUE"

Output: festivals.json  (written next to this script, or --output path)

festivals.json schema:
  {
    "updated": "2026-05-25T12:00:00Z",
    "films": [
      {
        "title": "Next Station: Lok Ma Chau",
        "festivals": [
          {
            "name": "New York HiCine Film Festival",
            "status": "winner",
            "label": "Award Winner"
          },
          ...
        ]
      },
      ...
    ]
  }

Status values (in descending rank):
  winner | finalist | honorable_mention | selected | not_accepted | withdrawn
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    sys.exit("Missing dependency: pip install beautifulsoup4")

try:
    import requests
except ImportError:
    requests = None  # only needed for live fetch


# ── Films that belong to Logan (match against project title in FilmFreeway) ──
MY_FILMS = {
    "next station: lok ma chau",
    "contact",
    "little egypt",
    "a little minor issue",
    "i'm stuck",
    "love! peace! joy!",
    # add more lowercase titles here as needed
}

# ── Status CSS class → canonical status + display label ──
STATUS_MAP = {
    "status-winner":           ("winner",           "Award Winner"),
    "status-accepted":         ("selected",         "Official Selection"),
    "status-finalist":         ("finalist",         "Finalist"),
    "status-honorable-mention":("honorable_mention","Honorable Mention"),
    "status-not-accepted":     ("not_accepted",     "Not Accepted"),
    "status-withdrawn":        ("withdrawn",        "Withdrawn"),
}

# Statuses worth keeping in the public output
NOTABLE_STATUSES = {"winner", "finalist", "honorable_mention", "selected"}


# ── Fetch from FilmFreeway ────────────────────────────────────────────────────

def fetch_live(cookie_string: str) -> dict:
    if requests is None:
        sys.exit("Missing dependency for live fetch: pip install requests")

    url = "https://filmfreeway.com/submissions/render_my_submissions.json"
    headers = {
        "Cookie":           cookie_string,
        "Accept":           "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Referer":          "https://filmfreeway.com/submissions/my_submissions",
        "User-Agent":       (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
    }
    print("Fetching from FilmFreeway ...", file=sys.stderr)
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


# ── Parse the submissions JSON ────────────────────────────────────────────────

def extract_film_title(project_soup) -> str:
    """Pull the project (film) title from a submission block."""
    # FilmFreeway wraps it in <h3 class="submission-project-title"> or similar
    for selector in [
        "h3.submission-project-title",
        ".project-title",
        "h3",
        "h2",
    ]:
        tag = project_soup.select_one(selector)
        if tag:
            return tag.get_text(strip=True)
    return ""


def extract_festival_rows(project_soup):
    """
    Yield (festival_name, status, label) for every submission entry
    inside a project block.
    """
    # Each festival submission lives in a row with class "submission-row"
    # or similar. Adjust selectors below if FilmFreeway's markup differs.
    rows = project_soup.select(".submission-row, .festival-submission, li.submission")
    if not rows:
        # Fallback: every element that carries a status class
        rows = project_soup.select("[class*='status-']")

    for row in rows:
        # Determine status
        status = label = None
        for css_class, (st, lb) in STATUS_MAP.items():
            if css_class in row.get("class", []):
                status, label = st, lb
                break
        # Also check child elements for status class
        if status is None:
            for css_class, (st, lb) in STATUS_MAP.items():
                if row.select_one(f".{css_class}"):
                    status, label = st, lb
                    break
        if status is None:
            continue  # no recognisable status

        # Try to override label with the actual award text in the HTML
        award_tag = row.select_one(".award-name, .status-label, .submission-status")
        if award_tag:
            text = award_tag.get_text(strip=True)
            if text:
                label = text

        # Festival name
        fest_tag = row.select_one(
            ".festival-name, .submission-festival-name, "
            "h4, h3.festival, span.name"
        )
        fest_name = fest_tag.get_text(strip=True) if fest_tag else ""
        if not fest_name:
            # last resort: first non-empty text node
            texts = [t.strip() for t in row.stripped_strings]
            fest_name = texts[0] if texts else "Unknown Festival"

        yield fest_name, status, label


def parse_submissions(data: dict) -> list[dict]:
    """
    data: the parsed JSON from render_my_submissions.json
    Returns: list of {title, festivals: [{name, status, label}]}
    """
    # The JSON has either:
    #   data["html"]         — one big HTML string
    #   data["submissions"]  — list of HTML strings per project
    # Handle both.

    html_chunks = []
    if isinstance(data, dict):
        if "html" in data:
            html_chunks.append(data["html"])
        elif "submissions" in data:
            html_chunks.extend(data["submissions"])
        else:
            # Try every string value that looks like HTML
            for v in data.values():
                if isinstance(v, str) and "<" in v:
                    html_chunks.append(v)
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, str):
                html_chunks.append(item)
            elif isinstance(item, dict):
                for v in item.values():
                    if isinstance(v, str) and "<" in v:
                        html_chunks.append(v)

    if not html_chunks:
        sys.exit("Could not find HTML content in the JSON. Check the file structure.")

    # Combine and parse
    combined_html = "\n".join(html_chunks)
    soup = BeautifulSoup(combined_html, "html.parser")

    # Find project-level containers
    project_containers = soup.select(
        ".project-submissions, .submission-project, "
        "[data-project], .project-group"
    )

    results = {}  # title -> [festival dicts]

    if project_containers:
        for container in project_containers:
            title = extract_film_title(container)
            if not title:
                continue
            if title.lower() not in MY_FILMS:
                continue  # skip films not ours

            fests = []
            for name, status, label in extract_festival_rows(container):
                if status in NOTABLE_STATUSES:
                    fests.append({"name": name, "status": status, "label": label})

            if title not in results:
                results[title] = []
            results[title].extend(fests)

    else:
        # Flat structure fallback: look for status elements and backtrack
        print(
            "Warning: no project containers found; trying flat parse.",
            file=sys.stderr,
        )
        for css_class, (status, label) in STATUS_MAP.items():
            if status not in NOTABLE_STATUSES:
                continue
            for el in soup.select(f".{css_class}"):
                # Walk up to find film title
                title = ""
                for parent in el.parents:
                    t = extract_film_title(parent)
                    if t:
                        title = t
                        break
                if not title or title.lower() not in MY_FILMS:
                    continue

                # Festival name: sibling or child text
                fest_tag = el.select_one(".festival-name, span.name, h4")
                fest_name = (
                    fest_tag.get_text(strip=True)
                    if fest_tag
                    else el.get_text(strip=True)
                )

                if title not in results:
                    results[title] = []
                results[title].append({
                    "name": fest_name,
                    "status": status,
                    "label": label,
                })

    # Sort each film's festival list: winner first, then finalist, etc.
    rank = ["winner", "finalist", "honorable_mention", "selected"]
    for title in results:
        results[title].sort(key=lambda f: rank.index(f["status"])
                            if f["status"] in rank else 99)

    return [{"title": t, "festivals": f} for t, f in results.items()]


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description="Parse FilmFreeway submissions JSON.")
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--file",   metavar="PATH",  help="Local JSON file to parse")
    src.add_argument("--cookie", metavar="VALUE", help="Full Cookie header string for live fetch")
    ap.add_argument("--output",  metavar="PATH",  default=str(Path(__file__).parent / "festivals.json"),
                    help="Output path (default: festivals.json next to this script)")
    ap.add_argument("--all-statuses", action="store_true",
                    help="Include not_accepted and withdrawn entries too")
    args = ap.parse_args()

    if args.all_statuses:
        NOTABLE_STATUSES.update({"not_accepted", "withdrawn"})

    if args.file:
        with open(args.file, encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = fetch_live(args.cookie)

    films = parse_submissions(data)

    output = {
        "updated": datetime.now(timezone.utc).isoformat(),
        "films": films,
    }

    out_path = Path(args.output)
    out_path.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    print(f"Wrote {len(films)} film(s) to {out_path}", file=sys.stderr)
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

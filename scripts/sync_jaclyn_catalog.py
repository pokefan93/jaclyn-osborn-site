from __future__ import annotations

import argparse
import html
import json
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urljoin
from zipfile import ZipFile
from xml.etree import ElementTree as ET

import requests


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK_DEFAULT = Path(r"A:\jaclyn_osborn_catalog_amazon_links.xlsx")
CATALOG_OUTPUT = ROOT / "src" / "data" / "catalog-data.ts"
COVERS_DIR = ROOT / "public" / "covers"

XML_NS = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
GOODREADS_AUTHOR_PAGES = [
    "https://www.goodreads.com/author/list/13856506.Jaclyn_Osborn",
    "https://www.goodreads.com/author/list/13856506.Jaclyn_Osborn?page=2",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

SERIES_META: dict[str, dict[str, Any]] = {
    "sons-of-the-fallen": {
        "source_name": "Sons of the Fallen",
        "name": "Sons of the Fallen",
        "lane": "Paranormal fantasy romance",
        "tagline": "Paranormal fantasy M/M romance.",
        "gradient": ["#2a1c2a", "#6f425e", "#c48273"],
        "textColor": "#fff5f0",
        "genres": ["paranormal", "fantasy"],
        "palette": "plum",
    },
    "sent-to-a-fantasy-world": {
        "source_name": "Sent To A Fantasy World and Now All the Men Want Me",
        "name": "Sent to a Fantasy World and Now All the Men Want Me",
        "lane": "Fantasy romance",
        "tagline": "Fantasy M/M romance.",
        "gradient": ["#2a2345", "#4a6ba5", "#e2b96f"],
        "textColor": "#fdf8ef",
        "genres": ["fantasy"],
        "palette": "cobalt",
    },
    "ivy-grove": {
        "source_name": "Ivy Grove",
        "name": "Ivy Grove",
        "lane": "Paranormal romance",
        "tagline": "Paranormal M/M romance.",
        "gradient": ["#23403d", "#7ea495", "#efd8bc"],
        "textColor": "#f8f4ef",
        "genres": ["paranormal"],
        "palette": "sage",
    },
    "unexpected-love": {
        "source_name": "Unexpected Love",
        "name": "Unexpected Love",
        "lane": "Contemporary romance",
        "tagline": "Contemporary M/M romance.",
        "gradient": ["#5d3640", "#cf8a7b", "#f2dfd3"],
        "textColor": "#fff7f1",
        "genres": ["contemporary"],
        "palette": "rose",
    },
    "blue-harbor": {
        "source_name": "Blue Harbor Romance",
        "name": "Blue Harbor",
        "lane": "Contemporary romance",
        "tagline": "Contemporary M/M romance.",
        "gradient": ["#1d3a46", "#6fa4b7", "#d8e7e6"],
        "textColor": "#f4fbfb",
        "genres": ["contemporary"],
        "palette": "teal",
    },
    "tales-of-fate": {
        "source_name": "Tales of Fate",
        "name": "Tales of Fate",
        "lane": "Historical fantasy romance",
        "tagline": "Historical fantasy M/M romance.",
        "gradient": ["#2a2435", "#7f5f5d", "#caa56c"],
        "textColor": "#fff7ea",
        "genres": ["historical", "fantasy"],
        "palette": "gold",
    },
    "axios": {
        "source_name": "Axios",
        "name": "Axios",
        "lane": "Fantasy romance",
        "tagline": "Fantasy M/M romance.",
        "gradient": ["#172433", "#3d5f73", "#b98b76"],
        "textColor": "#f6f7fb",
        "genres": ["fantasy"],
        "palette": "cobalt",
    },
    "awakening": {
        "source_name": "Awakening",
        "name": "Awakening",
        "lane": "M/M romance",
        "tagline": "M/M romance series.",
        "gradient": ["#2f2942", "#735c8f", "#d9c5b0"],
        "textColor": "#f8f3ef",
        "genres": [],
        "palette": "plum",
    },
    "port-haven": {
        "source_name": "Port Haven",
        "name": "Port Haven",
        "lane": "M/M romance",
        "tagline": "M/M romance series.",
        "gradient": ["#173546", "#4d87a1", "#d6e3e8"],
        "textColor": "#f5fbfc",
        "genres": [],
        "palette": "teal",
    },
    "love-in-addersfield": {
        "source_name": "Love in Addersfield",
        "name": "Love in Addersfield",
        "lane": "M/M romance",
        "tagline": "M/M romance series.",
        "gradient": ["#3a2430", "#9d6b7b", "#f0d8d2"],
        "textColor": "#fff7f4",
        "genres": [],
        "palette": "rose",
    },
    "cadbury": {
        "source_name": "Cadbury",
        "name": "Cadbury",
        "lane": "M/M romance",
        "tagline": "M/M romance series.",
        "gradient": ["#22263c", "#5b6d92", "#d9c9ab"],
        "textColor": "#f8f7f3",
        "genres": [],
        "palette": "cobalt",
    },
}

FEATURED_SLUGS = {
    "galen",
    "sent-to-a-fantasy-world-volume-1",
    "axios-a-spartan-tale",
}

NO_SERIES_PALETTES = ["rose", "teal", "gold", "cobalt", "sage", "ember", "plum"]


def slugify(value: str) -> str:
    value = value.lower().strip().replace("&", " and ").replace("’", "")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def normalize_title(value: str) -> str:
    value = value.lower().strip().replace("’", "'")
    value = re.sub(r"\s*\([^)]*\)$", "", value)
    value = value.replace(":", "").replace(",", "")
    value = re.sub(r"\s+", " ", value)
    return value


def cell_value(cell: ET.Element) -> str:
    cell_type = cell.attrib.get("t")
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.findall(".//x:t", XML_NS))

    value = cell.find("x:v", XML_NS)
    return value.text if value is not None else ""


def read_catalog_rows(workbook_path: Path) -> list[dict[str, str]]:
    with ZipFile(workbook_path) as archive:
        root = ET.fromstring(archive.read("xl/worksheets/sheet2.xml"))

    rows = []
    header = None
    for row in root.findall("x:sheetData/x:row", XML_NS):
        values = [cell_value(cell) for cell in row.findall("x:c", XML_NS)]
        if not header:
            header = values
            continue

        if not any(values):
            continue

        row_data = {header[index]: values[index] if index < len(values) else "" for index in range(len(header))}
        rows.append(row_data)

    return rows


def fetch_goodreads_entries(session: requests.Session) -> dict[str, str]:
    lookup: dict[str, str] = {}
    for url in GOODREADS_AUTHOR_PAGES:
        response = session.get(url, timeout=30)
        response.raise_for_status()
        matches = re.findall(
            r'<a class="bookTitle"[^>]+href="([^"]+)"[^>]*>\s*<span itemprop=["\']name["\'][^>]*>(.*?)</span>',
            response.text,
            re.S,
        )
        for href, raw_title in matches:
            title = html.unescape(raw_title).strip()
            lookup.setdefault(normalize_title(title), urljoin("https://www.goodreads.com", href))
    return lookup


def clean_description(raw_html: str) -> str:
    text = raw_html.replace("<br />", "\n").replace("<br/>", "\n").replace("<br>", "\n")
    text = re.sub(r"</p>\s*<p>", "\n\n", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    replacements = {
        "â€™": "’",
        "â€˜": "‘",
        "â€œ": "“",
        "â€\u009d": "”",
        "â€": "”",
        "â€¦": "…",
        "â€”": "—",
        "â€“": "–",
        "Ã©": "é",
        "Ã¨": "è",
        "Ã¶": "ö",
        "Ã¼": "ü",
        "Ã¡": "á",
        "Ã±": "ñ",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines()]
    chunks = []
    buffer: list[str] = []
    for line in lines:
        if not line:
            if buffer:
                chunks.append(" ".join(buffer).strip())
                buffer = []
            continue
        buffer.append(line)
    if buffer:
        chunks.append(" ".join(buffer).strip())
    return "\n\n".join(chunk for chunk in chunks if chunk)


def first_hook(description: str) -> str:
    if not description:
        return ""

    paragraph = description.split("\n\n", 1)[0].strip()
    sentence_match = re.match(r"(.+?[.!?])(\s|$)", paragraph)
    candidate = sentence_match.group(1).strip() if sentence_match else paragraph

    if len(candidate) <= 180:
        return candidate

    shortened = candidate[:177].rsplit(" ", 1)[0].rstrip(",;:-")
    return f"{shortened}..."


def parse_formats(formats_observed: str) -> list[str]:
    lowered = formats_observed.lower()
    if "not cleanly confirmed" in lowered:
        return []

    format_map = {
        "kindle": "ebook",
        "paperback": "paperback",
        "hardcover": "hardcover",
        "audiobook": "audiobook",
    }

    found: list[str] = []
    for key, value in format_map.items():
        if key in lowered:
            found.append(value)
    return found


def derive_status(price_note: str) -> tuple[str, str | None]:
    lowered = price_note.lower()
    if "out of print" in lowered:
        return "sold_out", price_note
    if "limited availability" in lowered:
        return "limited", price_note
    return "in_stock", None


def derive_genres(description: str, row: dict[str, str], series_slug: str) -> list[str]:
    series_genres = list(SERIES_META.get(series_slug, {}).get("genres", []))
    lowered = description.lower()
    for genre in ["contemporary", "fantasy", "paranormal", "historical"]:
        if genre in lowered and genre not in series_genres:
            series_genres.append(genre)
    if "ghost" in lowered or "haunted" in lowered:
        if "paranormal" not in series_genres:
            series_genres.append("paranormal")
    return series_genres


def get_palette(series_slug: str, standalone_index: int) -> str:
    if series_slug and series_slug in SERIES_META:
        return SERIES_META[series_slug]["palette"]
    return NO_SERIES_PALETTES[standalone_index % len(NO_SERIES_PALETTES)]


def load_goodreads_book(session: requests.Session, url: str) -> dict[str, Any]:
    response = session.get(url, timeout=30)
    response.raise_for_status()
    text = response.text

    next_data_match = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>',
        text,
        re.S,
    )
    if not next_data_match:
        raise RuntimeError(f"Missing __NEXT_DATA__ payload for {url}")

    next_data = json.loads(next_data_match.group(1))
    apollo_state = next_data["props"]["pageProps"]["apolloState"]
    book_node = next(
        value
        for value in apollo_state.values()
        if isinstance(value, dict) and value.get("__typename") == "Book"
    )

    image_match = re.search(r'<meta property="og:image" content="([^"]+)"', text)
    image_url = html.unescape(image_match.group(1)) if image_match else ""

    return {
        "title": book_node.get("title", ""),
        "description": clean_description(book_node.get("description", "")),
        "image_url": image_url,
    }


def series_slug_for_name(series_name: str) -> str:
    series_name = series_name.strip()
    for slug, meta in SERIES_META.items():
        if meta["source_name"] == series_name:
            return slug
    return ""


def display_title(row: dict[str, str]) -> str:
    title = row["Title"].strip()
    if row["Series"].strip() == "Sent To A Fantasy World and Now All the Men Want Me":
        return f"Volume {row['Series_Order'].split('.')[0]}"
    return title


def series_order_value(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        return 0.0


def build_series_data(books: list[dict[str, Any]]) -> list[dict[str, Any]]:
    books_by_series: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for book in books:
        if book["seriesSlug"] and book["seriesSlug"] in SERIES_META:
            books_by_series[book["seriesSlug"]].append(book)

    series_entries: list[dict[str, Any]] = []
    for slug, meta in SERIES_META.items():
        series_books = sorted(books_by_series.get(slug, []), key=lambda item: item["seriesOrder"])
        if not series_books:
            continue

        entry_point = series_books[0]["title"]
        other_titles = [book["title"] for book in series_books[1:]]
        if not other_titles:
            description = f"Starts with {entry_point}."
        elif len(other_titles) == 1:
            description = f"Start with {entry_point}, followed by {other_titles[0]}."
        else:
            description = (
                f"Start with {entry_point}. Other books in the series include "
                f"{', '.join(other_titles[:-1])}, and {other_titles[-1]}."
            )

        series_entries.append(
            {
                "slug": slug,
                "name": meta["name"],
                "lane": meta["lane"],
                "tagline": meta["tagline"],
                "description": description,
                "status": "Series",
                "entryPoint": entry_point,
                "gradient": meta["gradient"],
                "textColor": meta["textColor"],
                "highlight": [],
            }
        )

    return series_entries


def write_cover(session: requests.Session, image_url: str, slug: str) -> None:
    if not image_url:
        return

    response = session.get(image_url, timeout=30)
    response.raise_for_status()
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    cover_path = COVERS_DIR / f"{slug}.jpg"
    cover_path.write_bytes(response.content)


def format_ts_export(name: str, value: Any) -> str:
    return f"export const {name} = {json.dumps(value, indent=2, ensure_ascii=False)} as const;\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workbook", type=Path, default=WORKBOOK_DEFAULT)
    args = parser.parse_args()

    workbook_path: Path = args.workbook
    workbook_rows = read_catalog_rows(workbook_path)
    workbook_timestamp = datetime.fromtimestamp(workbook_path.stat().st_mtime).date().isoformat()

    session = requests.Session()
    session.headers.update(HEADERS)

    goodreads_lookup = fetch_goodreads_entries(session)

    books: list[dict[str, Any]] = []
    standalone_index = 0

    for row in workbook_rows:
        source_title = row["Title"].strip()
        normalized_title = normalize_title(source_title)
        goodreads_url = goodreads_lookup.get(normalized_title)
        if not goodreads_url:
            raise RuntimeError(f"Missing Goodreads match for {source_title}")

        goodreads_data = load_goodreads_book(session, goodreads_url)

        series_slug = series_slug_for_name(row["Series"])
        if not series_slug and row["Series"].strip() and row["Series"].strip() != "Snow Globe Christmas":
            raise RuntimeError(f"Unhandled series name: {row['Series']}")

        if not series_slug:
            palette = get_palette(series_slug, standalone_index)
            standalone_index += 1
        else:
            palette = get_palette(series_slug, standalone_index)

        slug = slugify(source_title)
        title = display_title(row)
        description = goodreads_data["description"].strip()
        short_hook = first_hook(description)
        formats = parse_formats(row["Formats_Observed"])
        availability_status, availability_label = derive_status(row["Amazon_Price_Snapshot"])
        purchase_label = "Search Amazon" if row["Link_Type"] == "Amazon search" else "Amazon"
        price_note = row["Amazon_Price_Snapshot"].strip()
        collection_label = row["Series"].strip() if row["Series"].strip() and not series_slug else ""

        book = {
            "id": slug,
            "slug": slug,
            "title": title,
            "seriesSlug": series_slug,
            "seriesLabel": collection_label,
            "seriesOrder": series_order_value(row["Series_Order"]),
            "releaseDate": f"{row['Publication_Year']}-01-01" if row["Publication_Year"] else "",
            "shortHook": short_hook or f"{title} by Jaclyn Osborn.",
            "description": description or f"{title} by Jaclyn Osborn.",
            "genres": derive_genres(description, row, series_slug),
            "vibes": [],
            "tropes": [],
            "formats": formats,
            "featured": slug in FEATURED_SLUGS,
            "coverPalette": palette,
            "catalogStatus": row["Status"].strip(),
            "purchase": {
                "availabilityStatus": availability_status,
                "availabilityLabel": availability_label,
                "priceNote": price_note,
                "priceSnapshotDate": workbook_timestamp,
                "merchandisingFlags": ["audiobook_available"] if "audiobook" in formats else [],
                "signedCopy": False,
                "directFromAuthor": False,
                "retailerLinks": [
                    {
                        "id": f"{slug}-amazon",
                        "retailer": "Amazon",
                        "label": purchase_label,
                        "purchaseMode": "external_retailer",
                        "purchaseUrl": row["Amazon_Link"].strip(),
                    }
                ]
                if row["Amazon_Link"].strip()
                else [],
                "directSaleFormats": [],
            },
        }
        books.append(book)

        write_cover(session, goodreads_data["image_url"], slug)

    series = build_series_data(books)

    header = (
        "// This file is generated by scripts/sync_jaclyn_catalog.py\n"
        f"// Sources: Goodreads author list pages and {workbook_path.name}\n\n"
    )
    output = header + format_ts_export("generatedSeries", series) + "\n" + format_ts_export("generatedBooks", books)
    CATALOG_OUTPUT.write_text(output, encoding="utf-8")


if __name__ == "__main__":
    main()

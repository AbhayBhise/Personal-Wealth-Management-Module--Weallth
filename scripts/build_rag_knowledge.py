"""
build_rag_knowledge.py — Production-Grade Document Reconstruction &
Semantic Classification RAG Pipeline.

Key features:
  1. Full Document Reconstruction: Rebuilds book tree (Book -> Front Matter / Parts / Chapters / Sections -> Paragraphs / Tables / Quotes / Case Studies).
  2. TOC-Driven Blueprint: Uses doc.get_toc() as authoritative blueprint for page & chapter boundaries.
  3. Semantic Classification Layer: Assigns primary_category, secondary_categories, keywords, concepts, entities, and content_type to every node.
  4. Hierarchical Inheritance: Child nodes inherit parent taxonomy metadata and merge local node classifications.
  5. Metadata-Only Lockouts: Cover, Title Page, Dedication, TOC, Copyright, Index, Publisher info remain in tree but are flagged as is_embeddable: false.
  6. Scoped Ligature & Normalization: Font artifacts ("ɹ" -> "fi", "ʃ" -> "ff") normalized cleanly without corrupting words.
  7. Min-Tokens & Sentence Overlap: Enforces min_tokens (250) and overlap (18%) for high-retrieval quality.
  8. PostgreSQL + pgvector Schema Ready: Output format is 100% compatible with backend ingestion.
"""
import argparse
import hashlib
import json
import logging
import os
import re
import sys
import unicodedata

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not installed. Please install via: pip install pymupdf")
    sys.exit(1)

try:
    import tiktoken
    _tokenizer = tiktoken.get_encoding("cl100k_base")
    def count_tokens(text):
        return len(_tokenizer.encode(text))
except ImportError:
    def count_tokens(text):
        return int(len(text.split()) * 1.3)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("rag_pipeline")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEALLTH_DIR = os.path.join(BASE_DIR, 'Weallth')
DEFAULT_OUT_DIR = os.path.join(BASE_DIR, 'app', 'backend', 'src', 'services', 'rag')
DEFAULT_PDF_PATH = os.path.join(
    WEALLTH_DIR,
    'Discover The Wealth Within You',
    'Ric Edelman - Discover the Wealth Within You_ A Financial Plan For Creating a Rich and Fulfilling Life-HarperCollins (2010).pdf'
)

# ---------------------------------------------------------------------------
# Semantic Taxonomy Taxonomy Definitions
# ---------------------------------------------------------------------------

PRIMARY_CATEGORIES = [
    'Goal Planning', 'Financial Planning', 'Wealth Building', 'Investment Strategy',
    'Asset Allocation', 'Portfolio Management', 'Mutual Funds', 'Retirement Planning',
    'Tax Planning', 'Estate Planning', 'Risk Management', 'Insurance Planning',
    'Cash Flow Management', 'Debt Management', 'Savings Strategy', 'Financial Independence',
    'Behavioral Finance', 'Decision Frameworks', 'Financial Education'
]

SECONDARY_CATEGORIES_MAP = {
    'Goal Planning': ['Goal Setting', 'Lifestyle Planning', 'Action Steps', 'Checklist'],
    'Financial Planning': ['Financial Education', 'Decision Frameworks', 'Financial Advisor Selection'],
    'Wealth Building': ['Wealth Psychology', 'Long-Term Investing', 'Financial Independence'],
    'Investment Strategy': ['Investment Vehicles', 'Market Behavior', 'Investment Mistakes', 'Asset Allocation Cake'],
    'Asset Allocation': ['Diversification', 'Portfolio Rebalancing', 'Stock Bond Mix'],
    'Portfolio Management': ['Portfolio Rebalancing', 'Diversification', 'Mutual Funds'],
    'Mutual Funds': ['Investment Vehicles', 'Active vs Passive', 'Index Funds', 'Fund Selection'],
    'Retirement Planning': ['Retirement Income', 'Longevity Planning', 'Tax-Deferred Investing'],
    'Tax Planning': ['Tax-Deferred Investing', 'Taxable Investing', 'Tax-Loss Harvesting'],
    'Estate Planning': ['Legacy Planning', 'Estate Documents', 'Asset Protection', 'Living Will'],
    'Risk Management': ['Insurance Planning', 'Emergency Fund', 'Asset Protection'],
    'Insurance Planning': ['Insurance Coverage', 'Disability Insurance', 'Long-Term Care'],
    'Cash Flow Management': ['Emergency Fund', 'Savings Strategy', 'Income vs Expenses'],
    'Debt Management': ['Debt Avalanche', 'Debt Snowball', 'Credit Card Payoff'],
    'Savings Strategy': ['Emergency Fund', 'Savings Rate', 'Automated Savings'],
    'Financial Independence': ['Retirement Income', 'Wealth Accumulation'],
    'Behavioral Finance': ['Wealth Psychology', 'Investment Mistakes', 'Market Panic'],
    'Decision Frameworks': ['Three-Option Solver', 'Goal Prioritization'],
    'Financial Education': ['Financial Calculations', 'Investment Concepts']
}

CATEGORY_PHRASE_WEIGHTS = {
    'Emergency Fund': ['emergency fund', 'cash reserve', 'liquid cash', 'savings rate', 'liquidity', 'emergency buffer', 'liquid asset'],
    'Debt Management': ['debt', 'credit card', 'interest rate', 'mortgage', 'avalanche', 'snowball', 'apr', 'loan payment'],
    'Retirement Planning': ['retirement', '401k', 'ira', 'roth', 'pension', 'longevity', 'withdrawal sequence', 'social security'],
    'Estate Planning': ['estate plan', 'living will', 'last will', 'trust', 'beneficiary', 'power of attorney', 'healthcare proxy', 'probate'],
    'Insurance Planning': ['insurance', 'disability', 'life insurance', 'long-term care', 'ltc', 'annuity', 'policy coverage'],
    'Asset Allocation': ['asset allocation', 'diversification', 'portfolio drift', 'rebalancing', 'stock bond mix', 'equity split', 'slice your cake'],
    'Goal Planning': ['financial goal', 'shortfall', 'three-option solver', 'option a', 'option b', 'option c', 'target amount', 'cabbie', 'dreams'],
    'Tax Planning': ['tax', 'capital gains', 'tax deduction', 'tax-advantaged', '1099', 'tax-deferred', 'taxable account'],
    'Mutual Funds': ['mutual fund', 'etf', 'index fund', 'active vs passive', 'load fund', 'expense ratio', 'fund manager'],
    'Investment Strategy': ['alpha', 'beta', 'sharpe ratio', 'dividend', 'dollar cost averaging', 'tulip bulbs', 'pound cake', 'cupcakes']
}

CONCEPT_PATTERNS = {
    'Three-Option Solver': r'\b(option a|option b|option c|eliminate any shortfall|three-option)\b',
    'Asset Allocation Cake': r'\b(pound cake|one-flavor cake|bake a cake|tray of cupcakes|ric\'s recipe|institutional investors)\b',
    'Emergency Cash Cushion': r'\b(emergency fund|cash reserve|liquid buffer|3 to 6 months)\b',
    'Goal Cabbie Analogy': r'\b(cabbie|cab driver|tell the driver|destination)\b',
    'Debt Avalanche vs Snowball': r'\b(avalanche|snowball|high-interest debt|credit card debt)\b',
    'Active vs Passive Management': r'\b(active management|passive management|index fund|world\'s dumbest investor)\b',
    'Tax-Deferred Compounding': r'\b(tax-deferred|taxable|401k|ira|roth|tax surprise)\b',
    'Longevity Inflation Risk': r'\b(longevity|living to 100|inflation|purchasing power)\b',
    'Dollar Cost Averaging': r'\b(dollar cost averaging|systematic investing|regular contributions)\b'
}

ENTITY_PATTERNS = {
    'Ric Edelman': r'\b(ric edelman|ric|author)\b',
    'Evelyn Vandermark': r'\b(evelyn vandermark|evelyn|skydiving)\b',
    'Lillian Brown': r'\b(lillian brown|lillian|machu picchu|87 in august)\b',
    'Penny Dawson': r'\b(penny dawson|penny)\b',
    'Bill Gates': r'\b(bill gates|richest man)\b',
    'Isaac Newton': r'\b(isaac newton|south sea bubble)\b',
    'HarperCollins': r'\b(harpercollins|publisher)\b',
    'OASIS': r'\b(oasis|senior surfers)\b',
    'Mayo Clinic': r'\b(mayo clinic)\b',
    'Lockheed': r'\b(lockheed)\b'
}

METADATA_ONLY_SECTIONS = {
    'COVER', 'TITLE_PAGE', 'DEDICATION', 'TABLE_OF_CONTENTS',
    'COPYRIGHT', 'INDEX', 'ABOUT_AUTHOR', 'ABOUT_PUBLISHER',
    'OTHER_BOOKS', 'BENEFIT_RIC', '1384_REASONS', 'AWARD_WINNING_ADVICE'
}

LIGATURE_MAP = {
    'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl',
    '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"', '•': '-',
    'ɹ': 'fi', 'ʃ': 'ff',
}

def clean_text(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFKC', text)
    for lig, rep in LIGATURE_MAP.items():
        text = text.replace(lig, rep)
    text = text.replace('—', ' -- ').replace('–', '-').replace('\xa0', ' ')
    text = re.sub(r'(\w+)-\s*\n\s*(\w+)', r'\1\2', text)
    text = re.sub(r'(\w)\s+(fi|ff|fl|ffi)\s+(\w)', r'\1\2\3', text)
    text = re.sub(r'(\w)\s+(fi|ff|fl|ffi)\b', r'\1\2', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def split_into_sentences_accurate(text):
    if not text:
        return []
    cleaned = text.replace('\n', ' ')
    cleaned = re.sub(r'(?<=\w\.\w\.)\s+', '  ', cleaned)
    cleaned = re.sub(r'(?<=[A-Z]\.)\s+', '  ', cleaned)
    sentences = re.split(r'(?<=[.!?])\s+', cleaned)
    return [s.strip() for s in sentences if len(s.strip()) > 3]

# ---------------------------------------------------------------------------
# Semantic Classification Layer Logic
# ---------------------------------------------------------------------------

def detect_content_type(text, node_type="PARAGRAPH", title=""):
    t_lower = text.lower()
    title_lower = title.lower()

    if node_type == "TABLE":
        return "Table"
    if "figure" in title_lower or "figure" in t_lower[:30]:
        return "Figure"
    if any(name in t_lower or name in title_lower for name in ["evelyn vandermark", "lillian brown", "penny dawson", "a case study"]):
        return "Case Study"
    if re.search(r'\b(for example|suppose you|consider a scenario|imagine|instance)\b', t_lower):
        return "Example"
    if text.startswith('~') or text.startswith('∼') or re.search(r'^\s*".*"\s*$', text, re.DOTALL):
        return "Quote"
    if re.search(r'^\s*(\d+\.|-|•|\*)\s+', text, re.MULTILINE):
        return "List"
    if re.search(r'\b(try this:|here\'s what i want you to do|step 1|checklist|action step)\b', t_lower):
        return "Action Step"
    if re.search(r'(\$\d+|\b\d+%\b|\bapr\b|\bnet worth\b|\bformula\b)', t_lower):
        return "Financial Calculation"
    
    return "Paragraph"

def classify_primary_category(text, heading_context=""):
    combined = (heading_context + " " + text).lower()
    scores = {cat: 0 for cat in CATEGORY_PHRASE_WEIGHTS.keys()}

    for cat, phrases in CATEGORY_PHRASE_WEIGHTS.items():
        for phrase in phrases:
            if phrase in combined:
                scores[cat] += 3 if phrase in heading_context.lower() else 1

    best_cat = max(scores, key=scores.get)
    if scores[best_cat] > 0:
        return best_cat
    
    if "goal" in combined or "cabbie" in combined:
        return "Goal Planning"
    if "fund" in combined or "stock" in combined or "cake" in combined:
        return "Investment Strategy"
    
    return "Financial Planning"

def classify_secondary_categories(primary_category, text):
    sec = list(SECONDARY_CATEGORIES_MAP.get(primary_category, ['Goal Setting', 'Lifestyle Planning']))
    t_lower = text.lower()

    if "emergency" in t_lower:
        sec.append("Emergency Fund")
    if "case study" in t_lower or "evelyn" in t_lower or "lillian" in t_lower:
        sec.append("Case Study")
    if "example" in t_lower:
        sec.append("Example")
    if "step" in t_lower or "try this" in t_lower:
        sec.append("Action Steps")
    if re.search(r'(\$\d+|\b\d+%\b)', t_lower):
        sec.append("Financial Calculations")

    return sorted(list(set(sec)))

def extract_concepts(text):
    concepts = []
    for concept, pattern in CONCEPT_PATTERNS.items():
        if re.search(pattern, text, re.IGNORECASE):
            concepts.append(concept)
    return concepts

def extract_entities(text):
    entities = []
    for entity, pattern in ENTITY_PATTERNS.items():
        if re.search(pattern, text, re.IGNORECASE):
            entities.append(entity)
    return entities

def extract_keywords(text):
    text_lower = text.lower()
    found = set()
    financial_terms = [
        'debt', 'credit card', 'interest rate', 'mortgage', 'avalanche', 'snowball', 'apr', 'loan',
        'emergency fund', 'cash reserve', 'liquidity', 'savings rate', 'buffer',
        'retirement', '401k', 'ira', 'roth', 'pension', 'longevity', 'withdrawal', 'social security',
        'estate', 'will', 'trust', 'beneficiary', 'power of attorney', 'healthcare proxy', 'probate',
        'insurance', 'life insurance', 'disability', 'long-term care', 'annuity', 'policy',
        'portfolio', 'asset allocation', 'diversification', 'stock', 'bond', 'mutual fund', 'etf', 'rebalancing',
        'goal', 'shortfall', 'compounding', 'inflation', 'wealth health score', 'tax', 'capital gains', 'dividend'
    ]
    for kw in financial_terms:
        if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
            found.add(kw)
    return sorted(list(found))

# ---------------------------------------------------------------------------
# Page Block & Structure Extraction
# ---------------------------------------------------------------------------

def extract_page_blocks(page):
    page_height, page_width = page.rect.height, page.rect.width
    top_limit, bottom_limit = page_height * 0.06, page_height * 0.94

    dict_data = page.get_text("dict")
    valid_blocks = []
    for b in dict_data.get("blocks", []):
        if b.get("type") != 0:
            continue
        bbox = b.get("bbox", (0, 0, 0, 0))
        y0, y1 = bbox[1], bbox[3]

        block_spans, max_font, is_bold = [], 0.0, False
        for line in b.get("lines", []):
            for span in line.get("spans", []):
                stext = span.get("text", "")
                if not stext:
                    continue
                fsize = round(span.get("size", 0), 1)
                flags = span.get("flags", 0)
                font_name = span.get("font", "").lower()
                span_bold = bool(flags & 2) or 'bold' in font_name or 'bld' in font_name
                max_font = max(max_font, fsize)
                is_bold = is_bold or span_bold
                block_spans.append({"text": stext, "font_size": fsize, "is_bold": span_bold})

        full_text = clean_text(" ".join(s["text"] for s in block_spans))
        if not full_text:
            continue

        if (y1 <= top_limit or y0 >= bottom_limit) and (full_text.isdigit() or len(full_text) < 50):
            continue

        valid_blocks.append({
            "bbox": bbox, "x0": bbox[0], "y0": bbox[1], "x1": bbox[2], "y1": bbox[3],
            "text": full_text, "spans": block_spans, "max_font": max_font, "is_bold": is_bold,
        })

    mid_point = page_width / 2.0
    left_col = [b for b in valid_blocks if b["x1"] <= mid_point + 20]
    right_col = [b for b in valid_blocks if b["x0"] >= mid_point - 20]
    if left_col and right_col and len(left_col) + len(right_col) >= len(valid_blocks) * 0.85:
        return sorted(left_col, key=lambda b: b["y0"]) + sorted(right_col, key=lambda b: b["y0"])
    return sorted(valid_blocks, key=lambda b: (b["y0"], b["x0"]))

def extract_page_tables(pdfplumber_page):
    tables = []
    try:
        for t in pdfplumber_page.extract_tables():
            if not t or not any(any(cell for cell in row) for row in t):
                continue
            tables.append([[('' if c is None else clean_text(str(c))) for c in row] for row in t])
    except Exception as e:
        log.debug("Table extraction failed on a page: %s", e)
    return tables

# ---------------------------------------------------------------------------
# Stage 2: TOC-driven Blueprint & Page Classification
# ---------------------------------------------------------------------------

BACK_MATTER_TITLES = {
    "sources": "SOURCES", "index": "INDEX", "about the author": "ABOUT_AUTHOR",
    "about the publisher": "ABOUT_PUBLISHER", "acknowledgments": "ACKNOWLEDGMENTS",
    "conclusion": "CONCLUSION", "copyright": "COPYRIGHT",
}
FRONT_MATTER_TITLES = {
    "cover": "COVER", "title page": "TITLE_PAGE", "dedication": "DEDICATION",
    "table of contents": "TABLE_OF_CONTENTS", "introduction": "INTRODUCTION",
}

def load_toc_structure(doc):
    toc = doc.get_toc()
    if not toc:
        log.warning("No embedded bookmarks found — falling back to BODY for all pages.")
        return [], {}

    entries = sorted([{"level": lvl, "title": title.strip(), "page": page} for lvl, title, page in toc], key=lambda x: (x["page"], x["level"]))

    page_type_map = {}
    for e in entries:
        key = e["title"].lower()
        ptype = FRONT_MATTER_TITLES.get(key) or BACK_MATTER_TITLES.get(key)
        if ptype:
            page_type_map[e["page"]] = ptype
        elif re.match(r'^part\b', key):
            page_type_map[e["page"]] = "PART_DIVIDER"
        elif re.match(r'^chapter\b', key):
            page_type_map[e["page"]] = "CHAPTER_TITLE_PAGE"

    return entries, page_type_map

def classify_page(page_num, page_type_map, toc_entries, sorted_bound_pages):
    if page_num in page_type_map:
        return page_type_map[page_num]
    preceding = [p for p in sorted_bound_pages if p <= page_num]
    if not preceding:
        return "FRONT_MATTER"
    last_boundary_page = preceding[-1]
    inherited = page_type_map.get(last_boundary_page, "BODY")
    if inherited in ("PART_DIVIDER", "CHAPTER_TITLE_PAGE", "TITLE_PAGE", "COPYRIGHT",
                      "DEDICATION", "TABLE_OF_CONTENTS", "COVER"):
        return "BODY"
    return inherited

def current_section_context(entries, page_num):
    part, chapter, section = "Front Matter", "Front Matter", "Overview"
    seen_real_part = False
    for e in entries:
        if e["page"] > page_num:
            break
        if e["level"] == 1:
            if re.match(r'^part\b', e["title"], re.IGNORECASE):
                part, chapter, section = e["title"], "Overview", "Overview"
                seen_real_part = True
            else:
                part = "Back Matter" if seen_real_part else "Front Matter"
                chapter, section = e["title"], "Overview"
        elif e["level"] == 2:
            chapter, section = e["title"], "Overview"
        elif e["level"] >= 3:
            section = e["title"]
    return part, chapter, section

# ---------------------------------------------------------------------------
# Stage 3: Document Tree & Semantic Classification Layer
# ---------------------------------------------------------------------------

def build_document_tree(page_records):
    tree = {}
    order = []
    seen_dedup_keys = set()

    for rec in page_records:
        part, chapter, section = rec["part"], rec["chapter"], rec["section"]
        key = (part, chapter, section)
        chapter_dict = tree.setdefault(part, {}).setdefault(chapter, {})
        if section not in chapter_dict:
            # Determine embeddable status for section
            is_embeddable = not (
                rec["page_type"] in METADATA_ONLY_SECTIONS or
                chapter in ["Front Matter", "Table of Contents", "Title Page", "Dedication", "Copyright", "Index", "About the Publisher"]
            )
            chapter_dict[section] = {
                "pages": [],
                "nodes": [],
                "is_embeddable": is_embeddable,
                "primary_category": "Financial Planning",
                "secondary_categories": [],
                "keywords": [],
                "concepts": [],
                "entities": []
            }
            order.append(key)

        node_bucket = chapter_dict[section]
        node_bucket["pages"].append(rec["page_num"])

        for block in rec["blocks"]:
            text = block["text"]
            if not text:
                continue
            dedup_key = (chapter, section, hashlib.sha256(text.encode()).hexdigest())
            if dedup_key in seen_dedup_keys:
                continue
            seen_dedup_keys.add(dedup_key)
            node_bucket["nodes"].append({
                "type": "PARAGRAPH",
                "text": text,
                "page_num": rec["page_num"]
            })

        for tbl in rec.get("tables", []):
            tbl_text = "\n".join(" | ".join(row) for row in tbl)
            node_bucket["nodes"].append({
                "type": "TABLE",
                "text": tbl_text,
                "page_num": rec["page_num"],
            })

    # Apply Semantic Classification Enrichment to Tree Nodes
    for (part, chapter, section) in order:
        bucket = tree[part][chapter][section]
        combined_section_text = " ".join(n["text"] for n in bucket["nodes"] if n.get("text"))
        heading_ctx = f"{chapter} {section}"

        prim_cat = classify_primary_category(combined_section_text, heading_context=heading_ctx)
        sec_cats = classify_secondary_categories(prim_cat, combined_section_text)
        kw = extract_keywords(combined_section_text)
        concepts = extract_concepts(combined_section_text)
        entities = extract_entities(combined_section_text)

        bucket["primary_category"] = prim_cat
        bucket["secondary_categories"] = sec_cats
        bucket["keywords"] = kw
        bucket["concepts"] = concepts
        bucket["entities"] = entities

        for n in bucket["nodes"]:
            t_text = n["text"]
            n["content_type"] = detect_content_type(t_text, node_type=n.get("type", "PARAGRAPH"), title=section)
            n["primary_category"] = prim_cat
            n["secondary_categories"] = sec_cats
            n["keywords"] = extract_keywords(t_text)
            n["concepts"] = extract_concepts(t_text)
            n["entities"] = extract_entities(t_text)

    return tree, order

# ---------------------------------------------------------------------------
# Stage 4: Semantic Chunking & Taxonomy Preservation
# ---------------------------------------------------------------------------

def create_semantic_chunks(tree, order, target_max_tokens=750, min_tokens=250, overlap_pct=0.18):
    raw_chunks = []

    for (part, chapter, section) in order:
        bucket = tree[part][chapter][section]
        if not bucket["is_embeddable"]:
            log.info("Skipping metadata-only section from embedding: %s -> %s", chapter, section)
            continue

        pages = sorted(set(bucket["pages"]))
        nodes = bucket["nodes"]
        if not nodes:
            continue

        current_nodes, current_tokens = [], 0
        section_chunks = []

        def flush(c_nodes):
            if not c_nodes:
                return
            body = "\n\n".join(n["text"] for n in c_nodes)
            content_types = sorted(list(set(n["content_type"] for n in c_nodes)))
            
            section_chunks.append({
                "part": part, "chapter": chapter, "section": section,
                "page_start": pages[0], "page_end": pages[-1], "pages": pages,
                "nodes": list(c_nodes), "text": body,
                "primary_category": bucket["primary_category"],
                "secondary_categories": bucket["secondary_categories"],
                "keywords": bucket["keywords"],
                "concepts": bucket["concepts"],
                "entities": bucket["entities"],
                "content_type": content_types[0] if len(content_types) == 1 else "Mixed Content",
                "content_types": content_types
            })

        for n in nodes:
            para_tokens = count_tokens(n["text"])
            if current_tokens + para_tokens > target_max_tokens and current_nodes:
                flush(current_nodes)
                overlap_target = int(current_tokens * overlap_pct)
                overlap_nodes, accum = [], 0
                for n_prev in reversed(current_nodes):
                    t = count_tokens(n_prev["text"])
                    overlap_nodes.insert(0, n_prev)
                    accum += t
                    if accum >= overlap_target:
                        break
                current_nodes, current_tokens = overlap_nodes, sum(count_tokens(x["text"]) for x in overlap_nodes)
            current_nodes.append(n)
            current_tokens += para_tokens
        flush(current_nodes)

        merged = []
        for c in section_chunks:
            if merged and count_tokens(c["text"]) < min_tokens:
                prev = merged[-1]
                prev["text"] += "\n\n" + c["text"]
                prev["nodes"] += c["nodes"]
                prev["page_end"] = c["page_end"]
                prev["pages"] = sorted(set(prev["pages"]) | set(c["pages"]))
            else:
                merged.append(c)
        raw_chunks.extend(merged)

    return raw_chunks

def format_final_chunks(raw_chunks, book_title="Discover The Wealth Within You", author="Ric Edelman"):
    final_chunks, seen_hashes = [], set()
    for c in raw_chunks:
        text = c["text"]
        h = hashlib.sha256(text.encode('utf-8')).hexdigest()
        if h in seen_hashes:
            continue
        seen_hashes.add(h)

        cid = f"dwwy_chunk_{len(final_chunks) + 1:04d}"
        prev_id = final_chunks[-1]["id"] if final_chunks else None

        final_chunks.append({
            "id": cid,
            "book": book_title,
            "author": author,
            "part": c["part"],
            "chapter": c["chapter"],
            "section": c["section"],
            "subsection": "General",
            "page_start": c["page_start"],
            "page_end": c["page_end"],
            "pages": c["pages"],
            "document_order": len(final_chunks) + 1,
            "chunk_index": len(final_chunks) + 1,
            "previous_chunk_id": prev_id,
            "next_chunk_id": None,
            "primary_category": c["primary_category"],
            "secondary_categories": c["secondary_categories"],
            "category": c["primary_category"],
            "keywords": c["keywords"],
            "concepts": c["concepts"],
            "entities": c["entities"],
            "content_type": c["content_type"],
            "content_types": c["content_types"],
            "title": f"{c['chapter']}: {c['section']}",
            "source": f"{book_title} - {c['chapter']}",
            "token_count": count_tokens(text),
            "paragraph_count": len(c["nodes"]),
            "sentence_count": len(split_into_sentences_accurate(text)),
            "hash": h,
            "text": text,
        })
    for i in range(len(final_chunks) - 1):
        final_chunks[i]["next_chunk_id"] = final_chunks[i + 1]["id"]
    return final_chunks

# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", default=DEFAULT_PDF_PATH, help="Path to the source PDF")
    ap.add_argument("--out-dir", default=DEFAULT_OUT_DIR, help="Output directory")
    ap.add_argument("--book-title", default="Discover The Wealth Within You", help="Book title for metadata")
    ap.add_argument("--author", default="Ric Edelman", help="Author for metadata")
    ap.add_argument("--checkpoint-every", type=int, default=50, help="Pages between checkpoint saves")
    args = ap.parse_args()

    if not os.path.exists(args.pdf):
        log.error("PDF not found: %s", args.pdf)
        sys.exit(1)

    out_dir = args.out_dir
    images_dir = os.path.join(out_dir, "images")
    checkpoint_path = os.path.join(out_dir, "_checkpoint.json")
    os.makedirs(images_dir, exist_ok=True)

    doc = fitz.open(args.pdf)
    total_pages = doc.page_count
    book_title = args.book_title or doc.metadata.get("title") or "Discover The Wealth Within You"
    author = args.author or doc.metadata.get("author") or "Ric Edelman"

    toc_entries, page_type_map = load_toc_structure(doc)
    sorted_bound_pages = sorted(page_type_map.keys())

    pdfplumber_doc = None
    try:
        import pdfplumber
        pdfplumber_doc = pdfplumber.open(args.pdf)
    except ImportError:
        log.warning("pdfplumber not installed — tables will not be extracted via pdfplumber.")

    start_page = 1
    page_records = []
    if os.path.exists(checkpoint_path):
        with open(checkpoint_path, "r", encoding="utf-8") as f:
            ckpt = json.load(f)
        page_records = ckpt.get("page_records", [])
        start_page = ckpt.get("last_completed_page", 0) + 1
        log.info("Resuming from checkpoint at page %d", start_page)

    error_pages = []

    for page_num in range(start_page, total_pages + 1):
        try:
            fitz_page = doc[page_num - 1]
            blocks = extract_page_blocks(fitz_page)

            tables = []
            if pdfplumber_doc is not None:
                tables = extract_page_tables(pdfplumber_doc.pages[page_num - 1])

            page_type = classify_page(page_num, page_type_map, toc_entries, sorted_bound_pages)
            part, chapter, section = current_section_context(toc_entries, page_num)

            page_records.append({
                "page_num": page_num, "page_type": page_type,
                "part": part, "chapter": chapter, "section": section,
                "blocks": blocks, "tables": tables,
            })
        except Exception as e:
            log.error("Failed on page %d: %s", page_num, e)
            error_pages.append(page_num)
            page_records.append({
                "page_num": page_num, "page_type": "ERROR",
                "part": None, "chapter": None, "section": None,
                "blocks": [], "tables": [],
            })

        if page_num % args.checkpoint_every == 0 or page_num == total_pages:
            with open(checkpoint_path, "w", encoding="utf-8") as f:
                json.dump({"last_completed_page": page_num, "page_records": page_records}, f)
            log.info("Progress: %d / %d pages", page_num, total_pages)

    if pdfplumber_doc is not None:
        pdfplumber_doc.close()

    tree, order = build_document_tree(page_records)
    raw_chunks = create_semantic_chunks(tree, order)
    final_chunks = format_final_chunks(raw_chunks, book_title=book_title, author=author)

    knowledge_path = os.path.join(out_dir, "rag_knowledge.json")
    with open(knowledge_path, "w", encoding="utf-8") as f:
        json.dump(final_chunks, f, indent=2, ensure_ascii=False)

    tokens = [c["token_count"] for c in final_chunks]
    report = {
        "book": book_title, "author": author,
        "total_pages": total_pages,
        "pages_processed": total_pages,
        "pages_with_errors": error_pages,
        "toc_entries_found": len(toc_entries),
        "total_embeddable_chunks": len(final_chunks),
        "avg_tokens_per_chunk": round(sum(tokens) / len(tokens), 1) if tokens else 0,
        "min_tokens": min(tokens) if tokens else 0,
        "max_tokens": max(tokens) if tokens else 0,
        "tables_extracted": sum(len(r.get("tables", [])) for r in page_records),
    }
    with open(os.path.join(out_dir, "validation_report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    if os.path.exists(checkpoint_path):
        os.remove(checkpoint_path)

    log.info("Done. %d chunks written to %s", len(final_chunks), knowledge_path)

if __name__ == "__main__":
    main()

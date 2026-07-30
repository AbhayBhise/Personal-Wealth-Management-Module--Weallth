import os
import json
import zipfile
import re
import xml.etree.ElementTree as ET

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEALLTH_DIR = os.path.join(BASE_DIR, 'Weallth')
OUTPUT_FILE = os.path.join(BASE_DIR, 'app', 'backend', 'src', 'services', 'rag', 'rag_knowledge.json')

chunks = []

def clean_text(text):
    text = re.sub(r'<[^<]+?>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text, max_words=350, overlap=50):
    words = text.split()
    if len(words) <= max_words:
        return [text] if len(words) >= 30 else []
    
    result = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + max_words]
        if len(chunk_words) >= 30:
            result.append(" ".join(chunk_words))
        i += (max_words - overlap)
    return result

def categorize_content(title, text):
    text_lower = (title + " " + text).lower()
    if 'debt' in text_lower or 'credit card' in text_lower or 'interest rate' in text_lower:
        return 'Debt Management'
    elif 'emergency' in text_lower or 'cash reserve' in text_lower or 'liquid' in text_lower:
        return 'Emergency Fund'
    elif 'retire' in text_lower or '401k' in text_lower or 'ira' in text_lower or 'longevity' in text_lower or 'pension' in text_lower:
        return 'Retirement'
    elif 'estate' in text_lower or 'will' in text_lower or 'trust' in text_lower or 'beneficiary' in text_lower or 'power of attorney' in text_lower:
        return 'Estate Planning'
    elif 'insurance' in text_lower or 'disability' in text_lower or 'life insurance' in text_lower or 'long term care' in text_lower:
        return 'Insurance'
    elif 'allocation' in text_lower or 'portfolio' in text_lower or 'diversif' in text_lower or 'stock' in text_lower or 'bond' in text_lower:
        return 'Asset Allocation'
    elif 'goal' in text_lower or 'shortfall' in text_lower or 'savings' in text_lower:
        return 'Goal Planning'
    elif 'persona' in text_lower or 'user story' in text_lower or 'client' in text_lower or 'advisor' in text_lower:
        return 'User Profiles & Personas'
    else:
        return 'General Wealth Strategy'

print("--- Step 1: Processing Ric Edelman Book (EPUB) ---")
epub_path = os.path.join(WEALLTH_DIR, 'Discover The Wealth Within You', 'Ric Edelman - Discover the Wealth Within You_ A Financial Plan For Creating a Rich and Fulfilling Life-HarperCollins (2010).epub')

skip_files = {'001-cover', '002-titlepage', '003-dedcation', '004-toc', '005-frontmatter1', '006-frontmatter2', '007-frontmatter3', '008-frontmatter4'}

if os.path.exists(epub_path):
    with zipfile.ZipFile(epub_path) as z:
        html_files = sorted([f for f in z.namelist() if f.endswith(('.html', '.xhtml', '.htm'))])
        chunk_idx = 1
        for fname in html_files:
            if any(s in fname for s in skip_files):
                continue

            content = z.read(fname).decode('utf-8', errors='ignore')
            text = clean_text(content)
            
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            h1_match = re.search(r'<h[12][^>]*>(.*?)</h[12]>', content, re.IGNORECASE)
            chapter_title = clean_text(h1_match.group(1)) if h1_match else (clean_text(title_match.group(1)) if title_match else fname)
            
            if len(text) < 150 or 'Table of Contents' in chapter_title or 'Dedicated to' in text:
                continue

            sub_chunks = chunk_text(text, max_words=350, overlap=50)
            category = categorize_content(chapter_title, text)
            
            for sc in sub_chunks:
                # Filter out raw cover text repetitions
                if 'DISCOVER THE WEALTH WITHIN YOU A Financial Plan for Creating a Rich' in sc and len(sc) < 250:
                    continue
                chunks.append({
                    "id": f"dwwy_chunk_{chunk_idx:04d}",
                    "source": f"Discover The Wealth Within You - {chapter_title}",
                    "book": "Discover The Wealth Within You",
                    "category": category,
                    "title": chapter_title,
                    "text": sc
                })
                chunk_idx += 1
    print(f"Extracted {chunk_idx - 1} financial chunks from Ric Edelman Book.")

print("--- Step 2: Processing Global Personal Wealth Management MD Files ---")
md_dir = os.path.join(WEALLTH_DIR, 'Research', 'Wealth AI Product Studio', 'Global Personal Wealth Management', 'MD Files')

if os.path.exists(md_dir):
    md_idx = 1
    for fname in sorted(os.listdir(md_dir)):
        if fname.endswith('.md'):
            fpath = os.path.join(md_dir, fname)
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                raw = f.read()
            
            text = clean_text(raw)
            doc_title = fname.replace('.md', '').replace('-', ' ')
            category = categorize_content(doc_title, text)
            sub_chunks = chunk_text(text, max_words=350, overlap=50)
            
            for sc in sub_chunks:
                chunks.append({
                    "id": f"gpwm_chunk_{md_idx:04d}",
                    "source": f"Global Personal Wealth Management - {doc_title}",
                    "book": "Global Personal Wealth Management Research",
                    "category": category,
                    "title": doc_title,
                    "text": sc
                })
                md_idx += 1
    print(f"Extracted {md_idx - 1} chunks from Global Personal Wealth Management MD files.")

print("--- Step 3: Processing DOCX files in Global Personal Wealth Management ---")
docx_dir = os.path.join(WEALLTH_DIR, 'Research', 'Wealth AI Product Studio', 'Global Personal Wealth Management')
if os.path.exists(docx_dir):
    docx_idx = 1
    for fname in sorted(os.listdir(docx_dir)):
        if fname.endswith('.docx'):
            fpath = os.path.join(docx_dir, fname)
            try:
                with zipfile.ZipFile(fpath) as z:
                    xml_content = z.read('word/document.xml')
                    tree = ET.fromstring(xml_content)
                    texts = [e.text for e in tree.iter() if e.text]
                    raw_text = clean_text(" ".join(texts))
                    
                    doc_title = fname.replace('.docx', '')
                    category = categorize_content(doc_title, raw_text)
                    sub_chunks = chunk_text(raw_text, max_words=350, overlap=50)
                    
                    for sc in sub_chunks:
                        chunks.append({
                            "id": f"docx_chunk_{docx_idx:04d}",
                            "source": f"Global Personal Wealth Research - {doc_title}",
                            "book": "Global Personal Wealth Management Research",
                            "category": category,
                            "title": doc_title,
                            "text": sc
                        })
                        docx_idx += 1
            except Exception as e:
                print(f"Error parsing DOCX {fname}: {e}")
    print(f"Extracted {docx_idx - 1} chunks from DOCX research files.")

print(f"Total Quality Chunks Generated: {len(chunks)}")

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(chunks, f, indent=2, ensure_ascii=False)

print(f"Successfully saved {len(chunks)} chunks to {OUTPUT_FILE}")

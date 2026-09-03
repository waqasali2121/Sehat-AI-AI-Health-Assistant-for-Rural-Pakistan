# ingest_documents.py
import os
import re
from typing import List, Dict, Any
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env and .env.local
load_dotenv()
load_dotenv(".env.local")

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Missing environment variables! Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.")

print(f"Connecting to Supabase at: {SUPABASE_URL}")
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize local HuggingFace embedding model (384 dimensions, fast & completely free)
print("📦 Loading local embedding model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Local embedding model ready!")

PDF_FILES = [
    {
        "path": "Pregnancy_Symptoms_and_Patient_Questions.pdf",
        "source": "Pregnancy Symptoms & Patient Questions",
        "default_category": "symptoms_and_faq"
    },
    {
        "path": "Pregnancy_Tests_and_Investigation_Guidelines.pdf",
        "source": "Pregnancy Tests & Investigation Guidelines",
        "default_category": "lab_investigations"
    },
    {
        "path": "Doctor_Advice_and_Conversation_Dataset.pdf",
        "source": "Doctor Advice + Conversation Dataset",
        "default_category": "clinical_advice"
    }
]

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract raw text from PDF file using PyPDF."""
    reader = PdfReader(pdf_path)
    full_text = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            full_text.append(f"\n--- [Page {idx + 1}] ---\n{text}")
    return "\n".join(full_text)

def clean_text(text: str) -> str:
    """Clean extra spaces and linebreaks."""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'(\n\s*){2,}', '\n\n', text)
    return text.strip()

def extract_metadata(chunk_text: str, file_info: Dict[str, Any]) -> Dict[str, Any]:
    """Rule-based metadata tagging for trimester, category, and topics."""
    text_lower = chunk_text.lower()

    # 1. Trimester detection
    trimester = "all"
    if any(k in text_lower for k in ["first trimester", "1st trimester", "week 1", "week 12"]):
        trimester = "1st_trimester"
    elif any(k in text_lower for k in ["second trimester", "2nd trimester", "week 13", "week 27"]):
        trimester = "2nd_trimester"
    elif any(k in text_lower for k in ["third trimester", "3rd trimester", "week 28", "term"]):
        trimester = "3rd_trimester"

    # 2. Category & Topic detection
    category = file_info["default_category"]
    topic = "general_pregnancy"

    if any(k in text_lower for k in ["cbc", "ogtt", "hba1c", "blood group", "ultrasound", "thyroid", "urine", "infection"]):
        category = "lab_investigations"
        if "ogtt" in text_lower or "glucose" in text_lower or "diabetes" in text_lower:
            topic = "gestational_diabetes"
        elif "cbc" in text_lower or "anemia" in text_lower or "hemoglobin" in text_lower:
            topic = "anemia_cbc"
        elif "ultrasound" in text_lower or "scan" in text_lower:
            topic = "ultrasound_scan"
        elif "thyroid" in text_lower or "tsh" in text_lower:
            topic = "thyroid_screening"

    elif any(k in text_lower for k in ["bleeding", "cramping", "headache", "nausea", "fever", "movement", "swelling"]):
        category = "symptoms_and_warning_signs"
        if "bleeding" in text_lower or "spotting" in text_lower:
            topic = "vaginal_bleeding"
        elif "headache" in text_lower or "preeclampsia" in text_lower:
            topic = "preeclampsia_hypertension"

    is_emergency = any(k in text_lower for k in [
        "heavy bleeding", "severe pain", "reduced movement", "fetal movement drop", "severe headache", "blurred vision", "convulsions", "collapse", "fainting"
    ])

    return {
        "source": file_info["source"],
        "category": category,
        "topic": topic,
        "trimester": trimester,
        "is_emergency_relevant": is_emergency
    }

def get_local_embedding(text: str) -> List[float]:
    """Generate 384-dimensional vector embedding locally using sentence-transformers."""
    embedding = embedding_model.encode(text)
    return embedding.tolist()

def run_ingestion():
    # Character/Token splitter: ~3200 chars (~800 tokens), 600 chars overlap (~150 tokens)
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=3200,
        chunk_overlap=600,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    all_records = []

    for file_info in PDF_FILES:
        pdf_path = file_info["path"]
        if not os.path.exists(pdf_path):
            print(f"⚠️ PDF file not found at path: {pdf_path}. Skipping.")
            continue

        print(f"📖 Reading: {file_info['source']}...")
        raw_text = extract_text_from_pdf(pdf_path)
        cleaned = clean_text(raw_text)

        chunks = splitter.split_text(cleaned)
        print(f"   Generated {len(chunks)} chunks.")

        for idx, chunk in enumerate(chunks):
            meta = extract_metadata(chunk, file_info)
            meta["chunk_index"] = idx

            print(f"   Generating local 384d embedding for chunk {idx + 1}/{len(chunks)}...")
            vector = get_local_embedding(chunk)

            all_records.append({
                "filename": os.path.basename(pdf_path),
                "content": chunk,
                "metadata": meta,
                "embedding": vector
            })

    if all_records:
        print(f"🚀 Uploading {len(all_records)} chunks to Supabase vector database...")
        batch_size = 30
        for i in range(0, len(all_records), batch_size):
            batch = all_records[i : i + batch_size]
            supabase_client.table("documents").insert(batch).execute()
            print(f"   Inserted batch {i // batch_size + 1}/{(len(all_records) + batch_size - 1) // batch_size}")

        print("✅ Success! All 3 PDF documents ingested successfully into Supabase with local embeddings!")

if __name__ == "__main__":
    run_ingestion()

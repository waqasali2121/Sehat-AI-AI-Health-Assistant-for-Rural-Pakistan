# Sehat AI Presentation Deck Instructions

I have designed and built a 10-slide presentation deck formatted in HTML & CSS (`sehat_ai_presentation_deck.html`).

### 📊 How to Export your Presentation PDF:
1. Open the file `sehat_ai_presentation_deck.html` in Microsoft Edge or Google Chrome.
2. Press `Ctrl + P` (Print).
3. Set Destination to **"Save as PDF"**.
4. Set Layout to **Landscape**.
5. Click **Save** as `Sehat_AI_Presentation.pdf`.

---

## 🎨 Slide Deck Overview:

### Slide 1: Title & Overview
- **Title:** Sehat AI – AI Health Assistant for Rural Pakistan
- **Tagline:** Empathetic, Multilingual, RAG-Powered Maternal Healthcare System for Rural Mothers & Lady Health Workers (LHWs).
- **Core Pillars:** RAG PDF Intelligence, Urdu Voice & Script, 1122 & BHU Locator.

### Slide 2: Critical Healthcare Gap
- **186** Deaths per 100k births in rural Pakistan.
- **80%** Preventable maternal complications.
- **30M+** Underserved rural mothers with 0 local Gynae specialists.
- Key barriers: Delay in complication recognition, geographical & literacy obstacles.

### Slide 3: The Innovation (Sehat AI Solution)
- **Dr. Ayesha (AI Doctor):** RAG-based AI consultation in Urdu/English.
- **15-Section Health Checker:** Full vital screening (BP, Hb Anemia, Baby Kicks).
- **BHU Locator & Booking:** Live GPS Haversine distance ranking & Google Maps route.
- **100% Offline Safety Network:** Guaranteed local fallback engine when internet fails.

### Slide 4: Full Product Capabilities
- **🗣️ Urdu Voice & Speech:** Web Speech API TTS ("سنیں Play") & voice note dictation.
- **💳 Digital Pregnancy Health Card:** Downloadable PNG card with QR verification & risk flags.
- **🚨 1-Tap 1122 Emergency Alert:** Emergency ambulance dispatch for severe red flags.
- **🤰 Gestational Tracker Wheel:** Weekly progress wheel + daily water intake logger.

### Slide 5: Robust Tech Stack & RAG Architecture
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Database & RAG:** Supabase PostgreSQL with `pgvector` extension (384d PDF document vector embeddings).
- **AI & Embeddings:** OpenAI `gpt-4o-mini`, `text-embedding-3-small`, and local MiniLM embeddings.
- **Dual Fallback Strategy:** Vector similarity RPC ➔ Keyword search ➔ Local clinical database.

### Slide 6: Patient Journey Walkthrough
1. **Step 1:** Mother asks voice/text question in Urdu script.
2. **Step 2:** System retrieves PDF clinical guidelines from Supabase RAG.
3. **Step 3:** Dr. Ayesha provides clear kick-count advice & warning signs.
4. **Step 4:** System displays nearest BHU (e.g. 2.4 km away), map route, & reserves token.

### Slide 7: Field Impact & Scalability
- **100,000+** LHW workforce support across Pakistan.
- **0s** Emergency response delay.
- Seamless mobile workflow for Lady Health Workers like Nasreen Akhtar (Chak 42-SB).

### Slide 8: Medical Safety & Ethics Guardrails
- **Non-Diagnostic Disclaimer:** Preserves doctor-patient relationship.
- **RAG Vector Citation:** Direct PDF source chunk attribution to eliminate hallucinations.
- **Row Level Security (RLS):** Supabase Postgres security policies protecting patient privacy.
- **Red-Flag Overrides:** Automatic 1122 emergency alerts for severe symptoms.

### Slide 9: Scaling Roadmap
- **Phase 1 (Current):** Punjab BHU Pilot, RAG vector retrieval, Urdu voice navigation.
- **Phase 2 (Q4 2026):** Multi-dialect rollout (Punjabi, Sindhi, Pashto, Balochi).
- **Phase 3 (2027):** Tele-Doctor video consultations with THQ/DHQ gynecologists.

### Slide 10: Conclusion & Q&A
- Saving mothers' lives with empathetic, multilingual AI.
- Q&A session with hackathon judges.

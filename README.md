# 🏥 Sehat AI (صحت اے آئی) – AI Health Assistant for Rural Pakistan

> **Empathetic, Multilingual, RAG-Powered AI Maternal Healthcare Assistant for Rural Women & Lady Health Workers (LHWs) in Pakistan.**

---

## 📌 Executive Summary
**Sehat AI (صحت اے آئی)** is a multilingual, AI-powered maternal healthcare assistant specifically engineered for **pregnant women and Lady Health Workers (LHWs) in rural Pakistan**. 

In rural regions of Pakistan, maternal mortality remains dangerously high due to a lack of local gynecologists, severe delays in recognizing pregnancy complications, low literacy, and geographical barriers to health facilities. **Sehat AI** bridges this gap by delivering **24/7 evidence-based medical advice, RAG-driven clinical guidelines from verified medical PDFs, voice-assisted interaction in Urdu and English, a 15-section pregnancy health checker, an automated BHU/Hospital GPS locator, and 1-tap 1122 emergency alerts.**

---

## 🎯 Target Audience (Who It's For)
1. **Pregnant Women in Rural Pakistan:** Particularly mothers in villages (*Chaks*) with limited literacy who require voice instructions in Urdu/Roman Urdu, easy symptom checking, and clear guidance on when to visit a doctor.
2. **Lady Health Workers (LHWs) & Lady Health Visitors (LHVs):** Frontline community healthcare workers seeking a digital tool for patient record management, triage assessment, and instant emergency referrals.
3. **Rural Health Facilities (BHUs, RHCs, THQs, DHQs):** Basic Health Units and Tehsil Hospitals receiving appointment tokens and structured patient symptom reports.

---

## 🛠️ What We Built (Full Product Features)

### 1. 🤖 RAG-Driven AI Doctor Chat (`/chat` & `/api/chat`)
- **Retrieval-Augmented Generation (RAG):** Integrates **Supabase `pgvector`** similarity search over 384-dimensional vector embeddings generated from official clinical guidelines PDFs (`Pregnancy_Symptoms_and_Patient_Questions.pdf`, `Pregnancy_Tests_and_Investigation_Guidelines.pdf`, `Doctor_Advice_and_Conversation_Dataset.pdf`).
- **Real-Time Source Citation:** Shows a **RAG Verified Medical Sources** badge with exact PDF filenames and match percentages under every answer.
- **Language Switcher:** Instant toggle between **Urdu (اردو / Roman Urdu)** and **English**.
- **Voice Assistance & TTS:** Integrated Web Speech Synthesis for spoken Urdu audio answers and voice note recording for low-literacy mothers.
- **100% Offline Medical Fallback Engine:** If internet access is lost or OpenAI API keys fail, the local `medical-database.ts` fallback engine generates topic-specific, non-repetitive clinical guidance for high-risk conditions (Preeclampsia, Anemia, Gestational Diabetes, Reduced Fetal Movement, Vaginal Bleeding, etc.).

---

### 2. 📍 GPS-Based BHU / Clinic Finder & Appointment Booking (`/clinics` & `facilities.ts`)
- **Live GPS Proximity Sorting:** Uses browser geolocation combined with the **Haversine Distance Formula** to rank nearby Basic Health Units (BHUs), Rural Health Centers (RHCs), Tehsil Headquarter Hospitals (THQs), and District Hospitals (DHQs) by distance in kilometers.
- **Map & Route Navigation:** Generates direct Google Maps driving/walking routes from the user's live coordinates to the selected facility.
- **Appointment Booking System:** Allows patients to reserve free rural clinic appointments, select time slots, specify visit reasons, and receive unique digital tokens (`BK-XXXXXX`).

---

### 3. 📋 Complete 15-Section Pregnancy Symptom Checker (`/symptoms`)
A comprehensive, self-fillable 15-section health evaluation form tailored for rural mothers:
1. **Basic Info:** Name, Age, Phone, Trimester (1–12, 13–27, 28+ weeks), EDD, Blood Group.
2. **Pregnancy Info:** First pregnancy status, Previous delivery outcomes (C-section, Miscarriage, Preterm).
3. **Current Problems:** Morning Sickness, General Health, and Emergency Red Flag Warning Signs.
4. **Blood Pressure:** Systolic/Diastolic inputs, BP Status, Preeclampsia symptoms.
5. **Weight Check:** Current vs Pre-pregnancy weight gain check.
6. **Baby Check:** Ultrasound status, Heartbeat, Baby growth, Movement, and Placenta condition.
7. **Blood Tests:** Hemoglobin (Hb/Anemia), Blood Sugar, Thyroid, Infection screening (Hepatitis B/C).
8. **Urine Test:** Proteinuria (Pre-eclampsia marker) and infection results.
9. **Vaginal Health:** Discharge, itching, and infection screening.
10. **Medical History:** Chronic condition screening (Diabetes, High BP, PCOS, Kidney, Asthma).
11. **Medicines & Supplements:** Folic Acid, Iron, Calcium, and Vitamin D tracking.
12. **Food & Lifestyle:** Nutritional intake (dal, spinach, eggs, milk) and hydration tracking.
13. **Vaccinations:** Tetanus (TT), Flu, and COVID vaccine records.
14. **Pregnancy Risk Check:** High-risk identification (Age >35, Twins, Placenta previa, High BP).
15. **Doctor Visit Plan:** Last visit date, next appointment, and doctor instructions.

---

### 4. 🚨 Emergency Alert & 1122 Dispatch System (`/emergency`)
- **1-Tap Emergency Trigger:** Instant access to call **1122 Rescue**, dispatch emergency ambulances, view duty doctors, and notify assigned Lady Health Workers.
- **Voice Emergency Instructions:** Spoken Urdu emergency guidance for critical situations like heavy bleeding or severe abdominal pain.

---

### 5. 💳 Digital Health Card & Patient Record System (`/health-card` & `/profile`)
- **Persistent Local Store:** Saves full patient profiles, gestational age, health conditions, and chat risk logs.
- **Downloadable Digital Health Card:** Uses canvas rendering (`html2canvas`) to generate a downloadable digital pregnancy card containing QR code verification, emergency contacts, blood group, and medical risk flags for presentation at rural hospital visits.

---

### 6. 📱 Interactive Dashboard & Education (`/dashboard` & `/education`)
- **Gestational Week Wheel Tracker:** Displays gestational progress percentage, remaining days count, and weekly baby size comparisons (e.g. *Ear of Sweet Corn* at Week 24).
- **Vitals & Hydration Tracker:** Daily water glass logger, medication reminders (Folic Acid/Iron), and blood pressure logs.
- **Audio-Visual Maternal Education:** Trimester-wise audio lessons on prenatal nutrition, labor preparation, and newborn care.

---

## 🏗️ Technical Architecture & Tech Stack

| Layer | Technology Used |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS v4, Material Symbols, Responsive Mobile-First Bento Design |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, RLS) |
| **Vector DB (RAG)** | Supabase `pgvector` extension (`documents` table with `match_documents` RPC) |
| **AI Model** | OpenAI `gpt-4o-mini` with custom Maternal Health System Prompts |
| **Embeddings** | OpenAI `text-embedding-3-small` / Local MiniLM embeddings |
| **Offline Engine** | Custom TypeScript Clinical Medical Database (`medical-database.ts`) |
| **Speech & Audio** | HTML5 Web Speech API (Urdu `ur-PK` & English `en-US` SpeechSynthesis) |
| **Geolocation** | HTML5 Browser Geolocation API + Haversine Distance Formula |
| **Canvas Export** | `html2canvas` for PNG Health Card generation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/waqasali2121/Sehat-AI-AI-Health-Assistant-for-Rural-Pakistan.git
cd Sehat-AI-AI-Health-Assistant-for-Rural-Pakistan/sehat-ai-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

4. Run the Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🌟 Key Differentiators

1. **Tailored for Pakistan's Rural Reality:** Built specifically around the localized healthcare system in Pakistan (BHUs, RHCs, LHWs, 1122 Rescue) with Roman Urdu & Urdu script support.
2. **Literacy-Inclusive UI:** Combines clear icons, high-contrast Material design, voice narration ("سنیں Play"), and audio recording so non-literate mothers can navigate effortlessly.
3. **Dual RAG + Offline Safety Network:** Uses RAG over verified medical PDFs and includes a 100% offline fallback database for zero-downtime medical safety.
4. **End-to-End Maternal Journey:** Covers every stage from pregnancy tracking and symptom screening to finding the nearest BHU and emergency hospital transport.

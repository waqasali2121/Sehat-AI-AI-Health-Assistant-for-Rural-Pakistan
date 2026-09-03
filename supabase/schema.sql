-- Sehat AI: Supabase Database Schema
-- Maternal healthcare assistant for rural Pakistan
-- Run this in Supabase SQL Editor or via `supabase db push`

-- ============================================================
-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INTEGER CHECK (age >= 13 AND age <= 50),
  village TEXT,
  preferred_language TEXT DEFAULT 'urdu' CHECK (preferred_language IN ('urdu', 'english', 'punjabi', 'sindhi', 'pashto')),
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'lhw', 'doctor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PREGNANCY PROFILES
-- ============================================================
CREATE TABLE public.pregnancy_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gestational_week INTEGER CHECK (gestational_week >= 4 AND gestational_week <= 42),
  expected_due_date DATE,
  is_first_pregnancy BOOLEAN DEFAULT true,
  previous_complications TEXT[] DEFAULT '{}',
  health_conditions TEXT[] DEFAULT '{}',
  blood_group TEXT,
  lhw_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. CHAT HISTORY (AI Doctor conversations)
-- ============================================================
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  risk_flag TEXT CHECK (risk_flag IN ('LOW', 'MEDIUM', 'HIGH')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. SYMPTOM ASSESSMENTS
-- ============================================================
CREATE TABLE public.symptom_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  symptoms TEXT[] NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  duration TEXT,
  gestational_week_at_assessment INTEGER,
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  triage_result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. DOCTOR KNOWLEDGE BASE
-- ============================================================
CREATE TABLE public.doctor_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nutrition', 'prenatal', 'labor', 'postpartum', 'newborn', 'emergency', 'general')),
  content TEXT NOT NULL,
  content_urdu TEXT,
  trimester INTEGER CHECK (trimester >= 1 AND trimester <= 3),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. DOCTORS
-- ============================================================
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  specialization TEXT,
  phone TEXT,
  email TEXT,
  facility_name TEXT,
  facility_location TEXT,
  is_available BOOLEAN DEFAULT false,
  consultation_fee DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. APPOINTMENTS
-- ============================================================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  consultation_type TEXT DEFAULT 'in-person' CHECK (consultation_type IN ('in-person', 'video', 'phone')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. EDUCATION CONTENT
-- ============================================================
CREATE TABLE public.education_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_urdu TEXT,
  category TEXT NOT NULL CHECK (category IN ('nutrition', 'exercise', 'prenatal_care', 'labor_prep', 'postpartum', 'newborn_care', 'mental_health')),
  body TEXT NOT NULL,
  body_urdu TEXT,
  trimester INTEGER CHECK (trimester >= 0 AND trimester <= 3),
  audio_url TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_pregnancy_profiles_user ON public.pregnancy_profiles(user_id);
CREATE INDEX idx_chat_history_user ON public.chat_history(user_id);
CREATE INDEX idx_chat_history_created ON public.chat_history(user_id, created_at DESC);
CREATE INDEX idx_symptom_assessments_user ON public.symptom_assessments(user_id);
CREATE INDEX idx_doctor_knowledge_category ON public.doctor_knowledge(category);
CREATE INDEX idx_appointments_user ON public.appointments(user_id);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX idx_education_category ON public.education_content(category);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_content ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own record; doctors/LHWs can read patients they're linked to
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Doctors can view assigned patients" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.pregnancy_profiles pp WHERE pp.lhw_id = auth.uid() AND pp.user_id = public.users.id)
    OR EXISTS (SELECT 1 FROM public.doctors d WHERE d.user_id = auth.uid())
  );

-- Pregnancy profiles: owner can CRUD; LHW can read assigned
CREATE POLICY "Users can view own pregnancy profile" ON public.pregnancy_profiles
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = lhw_id);

CREATE POLICY "Users can manage own pregnancy profile" ON public.pregnancy_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Chat history: owner only
CREATE POLICY "Users can view own chat history" ON public.chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages" ON public.chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Symptom assessments: owner only
CREATE POLICY "Users can view own symptom assessments" ON public.symptom_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create symptom assessments" ON public.symptom_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Doctor knowledge: readable by all authenticated users
CREATE POLICY "Authenticated users can read knowledge base" ON public.doctor_knowledge
  FOR SELECT USING (auth.role() = 'authenticated');

-- Doctors: readable by all authenticated users
CREATE POLICY "Authenticated users can view doctors" ON public.doctors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Appointments: owner or doctor
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = doctor_id AND d.user_id = auth.uid())
  );

CREATE POLICY "Users can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Education content: readable by all authenticated users
CREATE POLICY "Authenticated users can read education" ON public.education_content
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pregnancy_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.doctor_knowledge
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.education_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

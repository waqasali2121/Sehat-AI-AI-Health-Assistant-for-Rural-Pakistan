export interface PatientData {
  fullName: string;
  age: number;
  phone: string;
  village: string;
  bloodGroup: string;
  gestationalWeek: number;
  expectedDueDate: string;
  isFirstPregnancy: boolean;
  previousComplications: string[];
  healthConditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  lhwName: string;
  lhwPhone: string;
}

export interface ChatRecord {
  id: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
  riskFlag?: "LOW" | "MEDIUM" | "HIGH";
  symptoms?: string[];
}

export interface SymptomFormSubmission {
  id: string;
  timestamp: string;
  patientName: string;
  age: number;
  phone: string;
  trimester: string;
  edd: string;
  bloodGroup: string;
  isFirstPregnancy: boolean;
  prevOutcomes: string[];
  morningSickness: string;
  generalHealth: string[];
  warningSigns: string[];
  bpSystolic: string;
  bpDiastolic: string;
  bpStatus: string;
  bpSymptoms: string[];
  currentWeight: string;
  preWeight: string;
  weightChange: string;
  ultrasoundDone: boolean;
  babyHeartbeat: string;
  babyMovement: string;
  placentaStatus: string;
  hemoglobin: string;
  bloodSugar: string;
  infections: string[];
  urineResult: string;
  vaginalSymptoms: string[];
  medicalHistory: string[];
  medicines: string[];
  dietaryHabits: string[];
  lifestyle: string[];
  vaccinations: string[];
  highRiskConditions: string[];
  lastDoctorVisit: string;
  nextDoctorAppointment: string;
  doctorAdvised: string[];
  hasEmergency: boolean;
}

export interface PatientRecord {
  id: string; // Unique patient record ID
  patient: PatientData;
  chatHistory: ChatRecord[];
  symptomFormSubmissions: SymptomFormSubmission[];
  createdAt: string;
  updatedAt: string;
}

const CURRENT_PATIENT_KEY = "sehat_ai_patient_record";
const ALL_RECORDS_KEY = "sehat_ai_all_patient_records";
const ADMIN_SESSION_KEY = "sehat_ai_admin_session";

const defaultPatient: PatientData = {
  fullName: "Fatima Bibi",
  age: 24,
  phone: "0300-1234567",
  village: "Chak 42-SB, Sargodha",
  bloodGroup: "B+",
  gestationalWeek: 24,
  expectedDueDate: "2026-11-20",
  isFirstPregnancy: true,
  previousComplications: [],
  healthConditions: ["Mild Anemia"],
  emergencyContactName: "Tariq Mahmood (Husband)",
  emergencyContactPhone: "0301-7654321",
  lhwName: "Nasreen Akhtar (LHW)",
  lhwPhone: "0302-8889991",
};

// Seed records if store is empty
const seedRecords: PatientRecord[] = [
  {
    id: "REC-42001",
    patient: defaultPatient,
    chatHistory: [
      {
        id: "chat-seed-1",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        userMessage: "Swelling in feet and mild headache",
        aiResponse: "Rest with legs elevated on a pillow, sleep on your left side, and lower salt intake. Visit BHU if headache worsens.",
        riskFlag: "MEDIUM",
      },
    ],
    symptomFormSubmissions: [
      {
        id: "FORM-901",
        timestamp: new Date().toISOString(),
        patientName: "Fatima Bibi",
        age: 24,
        phone: "0300-1234567",
        trimester: "13-27",
        edd: "2026-11-20",
        bloodGroup: "B+",
        isFirstPregnancy: true,
        prevOutcomes: [],
        morningSickness: "Mild vomiting",
        generalHealth: ["Feeling normal"],
        warningSigns: ["None of these"],
        bpSystolic: "118",
        bpDiastolic: "78",
        bpStatus: "Normal",
        bpSymptoms: ["No problem"],
        currentWeight: "62",
        preWeight: "58",
        weightChange: "Normal increase",
        ultrasoundDone: true,
        babyHeartbeat: "Normal",
        babyMovement: "Normal",
        placentaStatus: "Normal",
        hemoglobin: "Low (Anemia)",
        bloodSugar: "Normal",
        infections: ["Not checked"],
        urineResult: "Normal",
        vaginalSymptoms: ["No discharge problem"],
        medicalHistory: ["No"],
        medicines: ["Folic Acid", "Iron Tablets"],
        dietaryHabits: ["Healthy balanced food", "Drink enough water"],
        lifestyle: ["Walking/exercise regularly", "Sleeping well"],
        vaccinations: ["Tetanus vaccine"],
        highRiskConditions: ["No"],
        lastDoctorVisit: "2026-08-20",
        nextDoctorAppointment: "2026-09-15",
        doctorAdvised: ["Continue medicines"],
        hasEmergency: false,
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "REC-42002",
    patient: {
      fullName: "Zainab Parveen",
      age: 29,
      phone: "0302-9988776",
      village: "Chak 36-NB, Sargodha",
      bloodGroup: "O+",
      gestationalWeek: 32,
      expectedDueDate: "2026-10-15",
      isFirstPregnancy: false,
      previousComplications: ["Cesarean delivery"],
      healthConditions: ["High Blood Pressure"],
      emergencyContactName: "Muhammad Ali",
      emergencyContactPhone: "0300-9988771",
      lhwName: "Kausar Parveen (LHW)",
      lhwPhone: "0303-1122334",
    },
    chatHistory: [
      {
        id: "chat-seed-2",
        timestamp: new Date().toISOString(),
        userMessage: "Severe headache and blurred vision",
        aiResponse: "🚨 CRITICAL WARNING: High blood pressure (Preeclampsia risk). Please visit THQ Hospital immediately or call 1122.",
        riskFlag: "HIGH",
      },
    ],
    symptomFormSubmissions: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAllPatientRecords(): PatientRecord[] {
  if (typeof window === "undefined") return seedRecords;
  try {
    const raw = localStorage.getItem(ALL_RECORDS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(ALL_RECORDS_KEY, JSON.stringify(seedRecords));
  } catch {}
  return seedRecords;
}

export function getPatientRecord(): PatientRecord {
  if (typeof window === "undefined") {
    return seedRecords[0];
  }
  try {
    const raw = localStorage.getItem(CURRENT_PATIENT_KEY);
    if (raw) {
      const current = JSON.parse(raw);
      if (!current.id) current.id = "REC-42001";
      if (!current.symptomFormSubmissions) current.symptomFormSubmissions = [];
      return current;
    }
  } catch {}

  const initial = seedRecords[0];
  localStorage.setItem(CURRENT_PATIENT_KEY, JSON.stringify(initial));
  return initial;
}

export function savePatientData(patient: PatientData): void {
  if (typeof window === "undefined") return;
  const record = getPatientRecord();
  record.patient = patient;
  record.updatedAt = new Date().toISOString();
  if (!record.createdAt) record.createdAt = new Date().toISOString();
  if (!record.id) record.id = `REC-${Math.floor(10000 + Math.random() * 90000)}`;

  localStorage.setItem(CURRENT_PATIENT_KEY, JSON.stringify(record));
  syncRecordToAll(record);
}

export function saveSymptomFormSubmission(form: Omit<SymptomFormSubmission, "id" | "timestamp">): SymptomFormSubmission {
  const newSubmission: SymptomFormSubmission = {
    ...form,
    id: `FORM-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const record = getPatientRecord();
    if (!record.symptomFormSubmissions) record.symptomFormSubmissions = [];
    record.symptomFormSubmissions.unshift(newSubmission);
    record.updatedAt = new Date().toISOString();

    localStorage.setItem(CURRENT_PATIENT_KEY, JSON.stringify(record));
    syncRecordToAll(record);
  }
  return newSubmission;
}

export function addChatRecord(record: Omit<ChatRecord, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const data = getPatientRecord();
  const newRecord: ChatRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  data.chatHistory.push(newRecord);
  data.updatedAt = new Date().toISOString();

  localStorage.setItem(CURRENT_PATIENT_KEY, JSON.stringify(data));
  syncRecordToAll(data);
}

export function syncRecordToAll(record: PatientRecord): void {
  if (typeof window === "undefined") return;
  const all = getAllPatientRecords();
  const index = all.findIndex((r) => r.id === record.id || r.patient.phone === record.patient.phone);
  if (index >= 0) {
    all[index] = record;
  } else {
    all.unshift(record);
  }
  localStorage.setItem(ALL_RECORDS_KEY, JSON.stringify(all));
}

export function getChatHistory(): ChatRecord[] {
  return getPatientRecord().chatHistory;
}

export function extractConditionsFromChat(history: ChatRecord[]): string[] {
  const conditions = new Set<string>();
  const keywords: Record<string, string[]> = {
    "Swelling / Edema": ["swelling", "edema", "feet swell", "hand swell", "puffy"],
    "Anemia": ["anemia", "low hemoglobin", "weak", "pale", "thakawat"],
    "High Blood Pressure": ["blood pressure", "high bp", "hypertension", "sir dard", "headache"],
    "Gestational Diabetes": ["diabetes", "sugar", "blood sugar"],
    "Hyperemesis Gravidarum": ["vomiting", "nausea", "subbha ki ultee", "severe vomiting"],
    "Reduced Fetal Movement": ["baby not moving", "less movement", "fetal movement"],
    "Bleeding Risk": ["bleeding", "khoon", "spotting", "blood"],
  };

  for (const chat of history) {
    const text = (chat.userMessage + " " + chat.aiResponse).toLowerCase();
    for (const [condition, words] of Object.entries(keywords)) {
      if (words.some((w) => text.includes(w))) {
        conditions.add(condition);
      }
    }
  }
  return Array.from(conditions);
}

export function getRiskLevel(history: ChatRecord[]): "LOW" | "MEDIUM" | "HIGH" {
  const highRiskKeywords = ["bleeding", "severe", "emergency", "hospital", "khoon", "critical"];
  const medRiskKeywords = ["swelling", "headache", "vomiting", "pain", "dizzy"];

  let hasHigh = false;
  let hasMed = false;

  for (const chat of history) {
    if (chat.riskFlag === "HIGH") return "HIGH";
    if (chat.riskFlag === "MEDIUM") hasMed = true;

    const text = chat.userMessage.toLowerCase();
    if (highRiskKeywords.some((k) => text.includes(k))) hasHigh = true;
    if (medRiskKeywords.some((k) => text.includes(k))) hasMed = true;
  }

  if (hasHigh) return "HIGH";
  if (hasMed) return "MEDIUM";
  return "LOW";
}

export function isProfileComplete(): boolean {
  const { patient } = getPatientRecord();
  return !!(patient.fullName && patient.age && patient.gestationalWeek);
}

// ADMIN AUTH HELPERS
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === "active";
  } catch {}
  return false;
}

export function setAdminSession(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) {
    localStorage.setItem(ADMIN_SESSION_KEY, "active");
  } else {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

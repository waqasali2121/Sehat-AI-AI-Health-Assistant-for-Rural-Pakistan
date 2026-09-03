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

export interface PatientRecord {
  patient: PatientData;
  chatHistory: ChatRecord[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "sehat_ai_patient_record";

const defaultPatient: PatientData = {
  fullName: "",
  age: 0,
  phone: "",
  village: "",
  bloodGroup: "",
  gestationalWeek: 20,
  expectedDueDate: "",
  isFirstPregnancy: true,
  previousComplications: [],
  healthConditions: [],
  emergencyContactName: "",
  emergencyContactPhone: "",
  lhwName: "",
  lhwPhone: "",
};

export function getPatientRecord(): PatientRecord {
  if (typeof window === "undefined") {
    return { patient: defaultPatient, chatHistory: [], createdAt: "", updatedAt: "" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { patient: defaultPatient, chatHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

export function savePatientData(patient: PatientData): void {
  if (typeof window === "undefined") return;
  const record = getPatientRecord();
  record.patient = patient;
  record.updatedAt = new Date().toISOString();
  if (!record.createdAt) record.createdAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

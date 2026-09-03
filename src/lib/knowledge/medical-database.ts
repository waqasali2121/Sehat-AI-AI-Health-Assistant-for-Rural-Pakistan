export interface MedicalCondition {
  condition_name: string;
  category: string;
  definition: string;
  pregnancy_stage: string;
  symptoms: string[];
  risk_factors: string[];
  mother_complications: string[];
  baby_complications: string[];
  diagnosis: string[];
  medical_management: string[];
  emergency_signs: string[];
  prevention: string[];
  doctor_recommendation: string;
}

export const medicalKnowledge: MedicalCondition[] = [
  {
    condition_name: "Hyperemesis Gravidarum",
    category: "early_pregnancy",
    definition:
      "A severe form of pregnancy nausea and vomiting causing dehydration, weight loss, and nutritional imbalance.",
    pregnancy_stage: "First trimester, may continue into later pregnancy",
    symptoms: [
      "Severe vomiting",
      "Unable to tolerate food or fluids",
      "Weight loss",
      "Weakness",
      "Dizziness",
      "Reduced urination",
    ],
    risk_factors: [
      "Previous hyperemesis pregnancy",
      "Multiple pregnancy",
      "Molar pregnancy",
      "History of severe morning sickness",
    ],
    mother_complications: [
      "Dehydration",
      "Electrolyte imbalance",
      "Malnutrition",
      "Kidney problems",
    ],
    baby_complications: ["Low birth weight", "Poor fetal growth"],
    diagnosis: [
      "Clinical assessment",
      "Urine ketones",
      "Blood electrolyte tests",
      "Weight monitoring",
      "Ultrasound",
    ],
    medical_management: [
      "Oral hydration",
      "IV fluids if severe",
      "Pregnancy-safe anti-vomiting medicines",
      "Nutritional support",
      "Hospital admission if required",
    ],
    emergency_signs: [
      "Cannot drink fluids",
      "Severe weakness",
      "Fainting",
      "Blood in vomit",
    ],
    prevention: ["Early pregnancy care", "Small frequent meals", "Adequate hydration"],
    doctor_recommendation:
      "Women with persistent vomiting should consult an obstetrician.",
  },
  {
    condition_name: "Ectopic Pregnancy",
    category: "early_pregnancy",
    definition:
      "A pregnancy that develops outside the uterus, commonly inside the fallopian tube.",
    pregnancy_stage: "First trimester",
    symptoms: [
      "One-sided abdominal pain",
      "Vaginal bleeding",
      "Shoulder pain",
      "Dizziness",
      "Fainting",
    ],
    risk_factors: [
      "Previous ectopic pregnancy",
      "Tubal surgery",
      "Pelvic infection",
      "Fertility treatment",
    ],
    mother_complications: ["Internal bleeding", "Shock", "Life-threatening emergency"],
    baby_complications: ["Pregnancy cannot continue normally"],
    diagnosis: ["Pregnancy hormone beta-hCG", "Transvaginal ultrasound"],
    medical_management: [
      "Medication (Methotrexate)",
      "Surgical treatment if rupture occurs",
    ],
    emergency_signs: ["Severe abdominal pain", "Collapse", "Heavy bleeding"],
    prevention: ["Early pregnancy ultrasound", "Regular antenatal care"],
    doctor_recommendation: "Urgent obstetric evaluation required.",
  },
  {
    condition_name: "Miscarriage (Spontaneous Abortion)",
    category: "early_pregnancy",
    definition: "Loss of pregnancy before fetal viability.",
    pregnancy_stage: "Usually first trimester",
    symptoms: ["Vaginal bleeding", "Abdominal cramps", "Tissue passing from vagina"],
    risk_factors: [
      "Chromosomal abnormalities",
      "Maternal infections",
      "Hormonal problems",
      "Uterine abnormalities",
    ],
    mother_complications: ["Heavy bleeding", "Infection", "Emotional distress"],
    baby_complications: ["Pregnancy loss"],
    diagnosis: ["Ultrasound", "Pregnancy hormone monitoring"],
    medical_management: [
      "Expectant management",
      "Medication",
      "Surgical evacuation if required",
    ],
    emergency_signs: ["Heavy bleeding", "Severe pain", "Fever"],
    prevention: ["Healthy lifestyle", "Prenatal care"],
    doctor_recommendation:
      "Medical assessment required after bleeding during pregnancy.",
  },
];

export function getKnowledgeContext(): string {
  return medicalKnowledge
    .map((c) => {
      return `
## ${c.condition_name} (${c.pregnancy_stage})
${c.definition}

Symptoms: ${c.symptoms.join(", ")}
Risk Factors: ${c.risk_factors.join(", ")}
Emergency Signs: ${c.emergency_signs.join(", ")}
Management: ${c.medical_management.join(", ")}
Recommendation: ${c.doctor_recommendation}`;
    })
    .join("\n\n---\n");
}

export function findRelevantConditions(query: string): MedicalCondition[] {
  const lower = query.toLowerCase();
  return medicalKnowledge.filter(
    (c) =>
      c.condition_name.toLowerCase().includes(lower) ||
      c.symptoms.some((s) => lower.includes(s.toLowerCase())) ||
      c.category.includes(lower) ||
      c.definition.toLowerCase().includes(lower)
  );
}

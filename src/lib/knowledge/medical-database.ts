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
    condition_name: "Pre-Eclampsia & Hypertensive Disorders",
    category: "second_third_trimester",
    definition:
      "A high blood pressure disorder occurring after 20 weeks of pregnancy, often accompanied by protein in urine and organ swelling.",
    pregnancy_stage: "Second & Third trimester (20+ weeks)",
    symptoms: [
      "Swelling in face and hands",
      "Severe headache",
      "Blurred vision or seeing spots",
      "Upper right abdominal pain",
      "High blood pressure (>140/90 mmHg)",
    ],
    risk_factors: [
      "First pregnancy",
      "Previous pre-eclampsia",
      "Chronic hypertension",
      "Multiple pregnancy (twins)",
      "Age > 35 or < 18",
    ],
    mother_complications: ["Eclampsia (seizures)", "HELLP syndrome", "Stroke", "Placental abruption"],
    baby_complications: ["Intrauterine growth restriction (IUGR)", "Preterm birth", "Placental insufficiency"],
    diagnosis: ["Blood pressure monitoring", "Urine protein dipstick", "Platelet & liver enzyme blood tests"],
    medical_management: ["Antihypertensive medication (Labetalol/Methyldopa)", "Magnesium sulfate for seizure prevention", "Monitored delivery at 37 weeks or earlier"],
    emergency_signs: ["Seizures", "Severe unremitting headache", "Vision loss", "Shortness of breath"],
    prevention: ["Low-dose aspirin (75-150mg) after 12 weeks for high risk", "Regular BP checks at BHU"],
    doctor_recommendation: "Immediate evaluation at BHU/THQ for BP > 140/90 or sudden face swelling.",
  },
  {
    condition_name: "Maternal Anemia",
    category: "all_trimesters",
    definition:
      "Low hemoglobin levels (<11 g/dL), extremely prevalent in rural Pakistan due to iron deficiency and nutritional gaps.",
    pregnancy_stage: "All trimesters, especially 2nd and 3rd",
    symptoms: [
      "Extreme fatigue and weakness",
      "Pale palms, gums, and inner eyelids",
      "Shortness of breath on mild exertion",
      "Dizziness and rapid heartbeat",
    ],
    risk_factors: ["Low dietary iron intake", "Short birth interval (<2 years)", "Hookworm infestation", "Heavy menstrual periods before pregnancy"],
    mother_complications: ["Increased risk of postpartum hemorrhage (PPH)", "Heart failure", "Lower resistance to infection"],
    baby_complications: ["Low birth weight (<2.5 kg)", "Premature delivery", "Fetal anemia"],
    diagnosis: ["Hemoglobin level check (Hb)", "Complete Blood Count (CBC)", "Serum ferritin"],
    medical_management: ["Oral Iron supplements (Ferrous Sulfate 200mg) + Folic Acid", "IV Iron sucrose if severe", "Blood transfusion if Hb < 7 g/dL near term"],
    emergency_signs: ["Fainting / Collapse", "Severe breathlessness at rest", "Chest pain"],
    prevention: ["Daily Folic acid & Iron tablets", "Diet rich in palak, dadi/saag, lobia, eggs, citrus fruits"],
    doctor_recommendation: "Check Hb at least once every trimester at your local LHW center or BHU.",
  },
  {
    condition_name: "Gestational Diabetes Mellitus (GDM)",
    category: "second_third_trimester",
    definition:
      "High blood sugar first recognized during pregnancy, usually around 24-28 weeks.",
    pregnancy_stage: "Second & Third trimester",
    symptoms: [
      "Excessive thirst",
      "Frequent urination",
      "Unexplained fatigue",
      "Recurrent vaginal infections",
    ],
    risk_factors: ["BMI > 25", "Family history of diabetes", "Polycystic ovary syndrome (PCOS)", "Previous large baby (>4kg)"],
    mother_complications: ["Pre-eclampsia", "Higher chance of C-section delivery", "Type 2 diabetes later in life"],
    baby_complications: ["Macrosomia (large baby)", "Neonatal hypoglycemia (low sugar at birth)", "Birth trauma"],
    diagnosis: ["Oral Glucose Tolerance Test (OGTT) at 24-28 weeks"],
    medical_management: ["Dietary modification (low sugar, high fiber)", "Daily blood glucose monitoring", "Insulin or Metformin if sugar remains high"],
    emergency_signs: ["Extreme confusion", "Fruit-smelling breath", "Persistent vomiting"],
    prevention: ["Healthy weight gain", "Active lifestyle (walking 30 mins daily)", "Limiting sweet beverages & refined carbs"],
    doctor_recommendation: "Screening at 24 weeks is essential for high-risk mothers.",
  },
  {
    condition_name: "Reduced Fetal Movement",
    category: "third_trimester",
    definition:
      "A noticeable decrease in baby's kicks or movements after 24-28 weeks of pregnancy.",
    pregnancy_stage: "Third trimester (24+ weeks)",
    symptoms: [
      "Fewer than 10 movements in 2 hours when lying on side",
      "Weak or faint baby kicks",
      "No movement felt for several hours",
    ],
    risk_factors: ["Placental insufficiency", "Low amniotic fluid (oligohydramnios)", "Fetal distress", "Maternal smoking or severe anemia"],
    mother_complications: ["Anxiety and distress"],
    baby_complications: ["Intrauterine fetal demise (stillbirth)", "Fetal hypoxia"],
    diagnosis: ["Kick count monitoring", "Cardiotocography (CTG)", "Obstetric Ultrasound with Doppler"],
    medical_management: ["Immediate CTG scan at hospital", "Ultrasound evaluation of amniotic fluid & blood flow", "Emergency delivery if fetal distress confirmed"],
    emergency_signs: ["Zero movement felt for >4 hours", "Absence of movement despite sweet drink & rest"],
    prevention: ["Daily kick counting after 28 weeks"],
    doctor_recommendation: "NEVER wait overnight if baby movements are reduced. Visit BHU/THQ hospital immediately.",
  },
  {
    condition_name: "Antepartum Hemorrhage (Vaginal Bleeding)",
    category: "second_third_trimester",
    definition:
      "Bleeding from the genital tract after 20 weeks of pregnancy until delivery.",
    pregnancy_stage: "Second & Third trimester",
    symptoms: [
      "Vaginal bleeding (bright red or dark)",
      "Abdominal or back pain",
      "Uterine tenderness or contractions",
    ],
    risk_factors: ["Placenta previa (low placenta)", "Placental abruption", "Uterine trauma", "High blood pressure"],
    mother_complications: ["Severe maternal shock", "Disseminated intravascular coagulation (DIC)", "Maternal death if untreated"],
    baby_complications: ["Fetal hypoxia", "Premature birth", "Fetal death"],
    diagnosis: ["Emergency ultrasound (speculum exam only after placenta previa excluded)"],
    medical_management: ["Immediate IV fluid resuscitation", "Strict bed rest", "Emergency Caesarean section"],
    emergency_signs: ["Heavy bleeding soaking a pad in <30 mins", "Severe continuous abdominal pain", "Fainting"],
    prevention: ["Regular antenatal checkups", "Avoiding heavy lifting"],
    doctor_recommendation: "ANY bleeding in pregnancy is an emergency. Call 1122 or visit hospital instantly.",
  },
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

// Generate structured response when OpenAI is offline or API fails
export function generateStructuredFallback(query: string, pregnancyWeek: number = 20): string {
  const lower = query.toLowerCase();
  const matched = findRelevantConditions(query);

  if (matched.length > 0) {
    const main = matched[0];
    return `1. **Patient Concern** — Assessment for ${main.condition_name} based on symptom description at week ${pregnancyWeek}.
2. **Possible Explanation** — ${main.definition} This is a known maternal condition requiring careful monitoring.
3. **Recommended Action** — ${main.medical_management.slice(0, 2).join(". ")}. Rest well, stay hydrated (8-10 glasses of water daily), and take prescribed prenatal supplements.
4. **Warning Signs** — ${main.emergency_signs.join(", ")}.
5. **When To Visit Doctor** — ${main.doctor_recommendation}
6. **Medical Disclaimer** — Sehat AI provides educational information only and does not replace in-person consultation with a qualified doctor.`;
  }

  // General fallback for unknown queries
  return `1. **Patient Concern** — General pregnancy health inquiry ("${query}") at week ${pregnancyWeek}.
2. **Possible Explanation** — Many symptoms during pregnancy (like mild fatigue, body changes, or swelling) are natural responses as your baby develops. However, any persistent discomfort should be evaluated.
3. **Recommended Action** — Maintain adequate hydration (8-10 glasses of clean water), eat a nutrient-rich diet (dals, green leafy vegetables, milk), take daily Folic acid/Iron supplements, and rest with legs elevated.
4. **Warning Signs** — Vaginal bleeding, severe abdominal pain, sudden face/hand swelling, blurred vision, severe headache, fever above 100.4°F, or reduced baby movements (<10 kicks in 2 hours).
5. **When To Visit Doctor** — Schedule a visit to your local BHU/RHC or consult your Lady Health Worker (LHW) within 24-48 hours. Seek emergency care immediately if warning signs develop.
6. **Medical Disclaimer** — Sehat AI provides educational assistance only and is not a substitute for professional medical diagnosis or emergency treatment.`;
}

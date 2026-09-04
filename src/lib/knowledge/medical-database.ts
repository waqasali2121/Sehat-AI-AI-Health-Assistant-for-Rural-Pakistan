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
];

export function getKnowledgeContext(): string {
  return medicalKnowledge
    .map((c) => {
      return `
## ${c.condition_name} (${c.pregnancy_stage})
${c.definition}

Symptoms: ${c.symptoms.join(", ")}
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

// Generate natural, direct response when OpenAI is offline or API fails
export function generateStructuredFallback(query: string, pregnancyWeek: number = 20, language: string = "english"): string {
  const matched = findRelevantConditions(query);

  if (language === "urdu") {
    if (matched.length > 0) {
      const main = matched[0];
      return `السلام علیکم۔ حمل کے ${pregnancyWeek}ویں ہفتے میں ${main.condition_name} کی علامات پر توجہ دینا ضروری ہے۔\n\n` +
        `**اہم مشورہ:** ${main.medical_management.slice(0, 2).join(". ")}۔ روزانہ 8-10 گلاس پانی پیئیں اور بائیں کروٹ سوئیں۔\n\n` +
        `**اگر یہ علامات ہوں تو فوراً بی ایچ یو یا ہسپتال جائیں:** ${main.emergency_signs.join("، ")}۔`;
    }
    return `السلام علیکم۔ حمل کے ${pregnancyWeek}ویں ہفتے میں صحت کا خیال رکھنا ضروری ہے۔\n\n` +
      `روزانہ 8 سے 10 گلاس صاف پانی پیئیں، غذائیت سے بھرپور کھانا (دالیں، پالک، لسی، انڈے) کھائیں اور آئرن اور فولک ایسڈ کی گولی لازمی لیں۔\n\n` +
      `اگر شدید سر درد، خون آنا، یا بچے کی حرکت کم محسوس ہو تو فوراً بی ایچ یو یا ڈاکٹر سے رابطہ کریں۔`;
  }

  if (matched.length > 0) {
    const main = matched[0];
    return `At week ${pregnancyWeek} of pregnancy, your concern aligns with **${main.condition_name}**.\n\n` +
      `**Recommended Steps:** ${main.medical_management.join(". ")}. Rest well, lie on your left side, and keep yourself hydrated (8-10 glasses of water daily).\n\n` +
      `**Red Flags to Watch:** ${main.emergency_signs.join(", ")}. If you notice any of these, visit your nearest BHU or hospital right away.`;
  }

  return `Regarding your concern at week ${pregnancyWeek} of pregnancy:\n\n` +
    `It is essential to stay well-hydrated (8-10 glasses of water daily), eat nutrient-rich foods (lentils, spinach, milk/eggs), take your daily Iron and Folic Acid supplements, and get sufficient rest.\n\n` +
    `**When to seek immediate care:** If you experience severe abdominal pain, vaginal bleeding, sudden swelling of face/hands, or a reduction in baby movements (<10 movements in 2 hours), visit your nearest BHU/THQ clinic or call 1122 immediately.`;
}

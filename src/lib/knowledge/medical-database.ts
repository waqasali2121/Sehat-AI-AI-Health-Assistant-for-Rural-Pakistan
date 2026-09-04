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
      "swelling", "feet", "face", "hands", "headache", "blurred vision", "high blood pressure", "bp", "preeclampsia"
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
    condition_name: "Maternal Anemia & Nutrition",
    category: "all_trimesters",
    definition:
      "Low hemoglobin levels (<11 g/dL), extremely prevalent in rural Pakistan due to iron deficiency and nutritional gaps.",
    pregnancy_stage: "All trimesters, especially 2nd and 3rd",
    symptoms: [
      "nutrition", "food", "diet", "eat", "anemia", "weakness", "fatigue", "tired", "pale", "dizzy", "iron"
    ],
    risk_factors: ["Low dietary iron intake", "Short birth interval (<2 years)", "Hookworm infestation"],
    mother_complications: ["Increased risk of postpartum hemorrhage (PPH)", "Heart failure"],
    baby_complications: ["Low birth weight (<2.5 kg)", "Premature delivery"],
    diagnosis: ["Hemoglobin level check (Hb)", "Complete Blood Count (CBC)"],
    medical_management: ["Oral Iron supplements (Ferrous Sulfate) + Folic Acid", "Iron-rich diet"],
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
      "diabetes", "sugar", "thirst", "frequent urination", "sugar test", "ogtt"
    ],
    risk_factors: ["BMI > 25", "Family history of diabetes"],
    mother_complications: ["Pre-eclampsia", "Higher chance of C-section delivery"],
    baby_complications: ["Macrosomia (large baby)", "Neonatal hypoglycemia"],
    diagnosis: ["Oral Glucose Tolerance Test (OGTT) at 24-28 weeks"],
    medical_management: ["Dietary modification (low sugar, high fiber)", "Daily blood glucose monitoring"],
    emergency_signs: ["Extreme confusion", "Fruit-smelling breath", "Persistent vomiting"],
    prevention: ["Healthy weight gain", "Active lifestyle (walking 30 mins daily)"],
    doctor_recommendation: "Screening at 24 weeks is essential for high-risk mothers.",
  },
  {
    condition_name: "Reduced Fetal Movement",
    category: "third_trimester",
    definition:
      "A noticeable decrease in baby's kicks or movements after 24-28 weeks of pregnancy.",
    pregnancy_stage: "Third trimester (24+ weeks)",
    symptoms: [
      "move", "movement", "kick", "baby not moving", "less movement", "no kick", "حرکت"
    ],
    risk_factors: ["Placental insufficiency", "Low amniotic fluid", "Fetal distress"],
    mother_complications: ["Anxiety and distress"],
    baby_complications: ["Intrauterine fetal demise", "Fetal hypoxia"],
    diagnosis: ["Kick count monitoring", "Cardiotocography (CTG)", "Ultrasound"],
    medical_management: ["Immediate CTG scan at hospital", "Ultrasound evaluation"],
    emergency_signs: ["Zero movement felt for >4 hours", "Absence of movement despite sweet drink"],
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
      "bleed", "bleeding", "blood", "spotting", "khoon", "خون"
    ],
    risk_factors: ["Placenta previa", "Placental abruption"],
    mother_complications: ["Severe maternal shock", "Maternal death if untreated"],
    baby_complications: ["Fetal hypoxia", "Premature birth"],
    diagnosis: ["Emergency ultrasound"],
    medical_management: ["Immediate IV fluid resuscitation", "Strict bed rest", "Emergency delivery"],
    emergency_signs: ["Heavy bleeding soaking a pad in <30 mins", "Severe abdominal pain", "Fainting"],
    prevention: ["Regular antenatal checkups"],
    doctor_recommendation: "ANY bleeding in pregnancy is an emergency. Call 1122 or visit hospital instantly.",
  },
  {
    condition_name: "Hyperemesis Gravidarum (Nausea & Vomiting)",
    category: "early_pregnancy",
    definition:
      "Severe pregnancy nausea and vomiting causing dehydration and weight loss.",
    pregnancy_stage: "First trimester",
    symptoms: [
      "nausea", "vomit", "vomiting", "sick", "morning sickness", "ultee", "الٹی"
    ],
    risk_factors: ["Previous hyperemesis", "Multiple pregnancy"],
    mother_complications: ["Dehydration", "Electrolyte imbalance"],
    baby_complications: ["Low birth weight"],
    diagnosis: ["Urine ketones", "Electrolyte tests"],
    medical_management: ["Oral hydration", "Pregnancy-safe anti-vomiting medication", "Small frequent meals"],
    emergency_signs: ["Cannot drink fluids", "Fainting", "Blood in vomit"],
    prevention: ["Small frequent meals", "Ginger tea", "Hydration"],
    doctor_recommendation: "Consult doctor if unable to keep fluids down for >24 hours.",
  },
];

export function getKnowledgeContext(): string {
  return medicalKnowledge
    .map((c) => {
      return `
## ${c.condition_name} (${c.pregnancy_stage})
${c.definition}

Symptoms/Keywords: ${c.symptoms.join(", ")}
Emergency Signs: ${c.emergency_signs.join(", ")}
Management: ${c.medical_management.join(", ")}
Recommendation: ${c.doctor_recommendation}`;
    })
    .join("\n\n---\n");
}

export function findRelevantConditions(query: string): MedicalCondition[] {
  const lower = query.toLowerCase();
  return medicalKnowledge.filter((c) => {
    const matchName = c.condition_name.toLowerCase().includes(lower);
    const matchSymptom = c.symptoms.some(
      (s) => lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower)
    );
    const matchDef = c.definition.toLowerCase().includes(lower);
    return matchName || matchSymptom || matchDef;
  });
}

// Generate highly relevant, direct, specific answers per topic
export function generateStructuredFallback(query: string, pregnancyWeek: number = 20, language: string = "english"): string {
  const q = query.toLowerCase();

  // 1. Reduced Fetal Movement
  if (q.includes("move") || q.includes("kick") || q.includes("حرکت")) {
    if (language === "urdu") {
      return `بچے کی حرکت میں کمی کی صورت حال (حمل کا ہفتہ ${pregnancyWeek}):\n\n` +
        `• **فوری عمل:** کچھ میٹھا (جیسے جوس یا گڑ) کھائیں یا پیئیں، پرسکون کمرے میں بائیں کروٹ لیٹیں اور 2 گھنٹے میں بچے کی حرکتیں گنیں۔\n` +
        `• **توقع:** 2 گھنٹے میں کم از کم 10 حرکتیں محسوس ہونی چاہیئں۔\n\n` +
        `⚠️ **اہم انتباہ:** اگر 2 گھنٹے میں 10 سے کم حرکتیں ہوں یا بالکل حرکت محسوس نہ ہو تو رات گزرنے کا انتظار نہ کریں۔ فوراً قریبی بی ایچ یو (BHU) یا تحصیل ہسپتال جائیں تاکہ سی ٹی جی (CTG) یا الٹراساؤنڈ سے بچے کی دھڑکن چیک کی جا سکے۔`;
    }
    return `Regarding reduced baby movement at week ${pregnancyWeek}:\n\n` +
      `• **Immediate Steps:** Eat or drink something sweet (juice or milk), lie down on your left side in a quiet room, and count movements over 2 hours.\n` +
      `• **Target Count:** You should feel at least 10 kicks/movements in 2 hours.\n\n` +
      `⚠️ **Red Flag Warning:** If you feel fewer than 10 movements in 2 hours or no movement at all, DO NOT wait overnight. Go directly to your nearest BHU or hospital for a CTG heart check or ultrasound evaluation.`;
  }

  // 2. Vaginal Bleeding / Spotting
  if (q.includes("bleed") || q.includes("blood") || q.includes("spot") || q.includes("khoon") || q.includes("خون")) {
    if (language === "urdu") {
      return `حمل کے دوران خون یا داغ آنے کی شکایت:\n\n` +
        `• **فوری ہدایات:** تمام کام کاج روک کر فوراً سیدھی یا بائیں کروٹ لیٹ جائیں۔ صاف پیڈ استعمال کریں اور اندر کچھ نہ ڈالیں۔\n\n` +
        `🚨 **ایمرجنسی الرٹ:** حمل میں خون آنا ہمیشہ سنجیدہ علامت ہے۔ فوراً 1122 پر کال کریں یا قریب ترین ہسپتال کے لیبر وارڈ جائیں۔ خون کے ساتھ پیٹ میں درد یا چکر آنا فوری طبی امداد کا تقاضا کرتا ہے۔`;
    }
    return `Vaginal bleeding or spotting during pregnancy (Week ${pregnancyWeek}):\n\n` +
      `• **Immediate Action:** Stop all physical activity and lie down immediately. Use a clean sanitary pad—never insert anything internally.\n\n` +
      `🚨 **EMERGENCY WARNING:** Any vaginal bleeding during pregnancy is a high-priority red flag. Proceed immediately to the nearest THQ/DHQ hospital or call 1122 ambulance. Do not wait for bleeding to stop on its own.`;
  }

  // 3. Swelling in feet / hands / face
  if (q.includes("swell") || q.includes("feet") || q.includes("edema") || q.includes("oedema") || q.includes("سوجن")) {
    if (language === "urdu") {
      return `پیروں یا ہاتھوں میں سوجن (حمل کا ہفتہ ${pregnancyWeek}):\n\n` +
        `• **معمول کی سوجن:** حمل کے 20 ہفتوں کے بعد ٹانگوں اور پیروں میں ہلکی سوجن عام ہے۔ دن میں 3 بار ٹانگیں تکیے پر اونچی رکھ کر 20 منٹ آرام کریں، بائیں کروٹ سوئیں اور کھانے میں نمک کم رکھیں۔\n\n` +
        `⚠️ **خطرناک علامات:** اگر چہرے یا آنکھوں کے گرد اچانک شدید سوجن ہو، شدید سر درد ہو یا نظر دھندلی ہو تو یہ ہائی بلڈ پریشر (Pre-eclampsia) کی علامت ہو سکتی ہے۔ 24 گھنٹے کے اندر بی ایچ یو جا کر بلڈ پریشر چیک کروائیں۔`;
    }
    return `Swelling in feet or hands at week ${pregnancyWeek}:\n\n` +
      `• **Normal Mild Swelling:** Mild foot and ankle swelling after 20 weeks is common due to fluid retention. Rest with your legs elevated on a pillow 3 times daily, sleep on your left side, and lower your salt intake.\n\n` +
      `⚠️ **Preeclampsia Warning:** Sudden swelling in your face, hands, or around your eyes accompanied by severe headache or blurred vision indicates dangerous high blood pressure. Visit your local BHU within 24 hours to check your blood pressure and urine protein.`;
  }

  // 4. Nutrition / Diet / Iron / Food
  if (q.includes("nutrit") || q.includes("food") || q.includes("diet") || q.includes("eat") || q.includes("iron") || q.includes("خراک") || q.includes("غذا")) {
    if (language === "urdu") {
      return `حمل کے دوران بہترین اور کم خرچ غذا (ہفتہ ${pregnancyWeek}):\n\n` +
        `• **روزانہ کی خوراک:** روزانہ دال یا لوبیا (پروٹین کے لیے)، ایک موسمی پھل، پالک یا ساگ (آئرن کے لیے لیموں نچوڑ کر)، اور 1 گلاس دودھ یا دہی لیں۔\n` +
        `• **ادویات:** ڈاکٹر کی ہدایت کے مطابق آئرن اور فولک ایسڈ کی گولی کھانے کے بعد لازمی لیں۔\n` +
        `• **پانی:** روزانہ 8 سے 10 گلاس صاف پانی پیئیں۔`;
    }
    return `Nutrition & Healthy Diet during pregnancy (Week ${pregnancyWeek}):\n\n` +
      `• **Daily Food Guide:** Eat protein and iron-rich affordable foods: lentils (dal), kidney beans (lobia), spinach/palak (with a squeeze of lemon to maximize iron absorption), seasonal fruits, and 1 glass of milk or yoghurt.\n` +
      `• **Supplements:** Take your prescribed Folic Acid and Iron tablets daily after meals.\n` +
      `• **Hydration:** Drink 8 to 10 glasses of clean water daily.`;
  }

  // 5. Headache / Blood Pressure
  if (q.includes("headache") || q.includes("bp") || q.includes("pressure") || q.includes("سر درد")) {
    if (language === "urdu") {
      return `سر درد اور بلڈ پریشر کی معلومات (حمل کا ہفتہ ${pregnancyWeek}):\n\n` +
        `• **اہمیت:** 20 ہفتوں کے بعد شدید سر درد یا بلڈ پریشر کا بڑھنا نظر انداز نہیں کرنا چاہیے۔\n` +
        `• **اقدامات:** پرسکون جگہ پر آرام کریں اور پانی پیئیں۔ اگر سر درد شدید ہو، دوا سے ٹھیک نہ ہو، یا نظر میں دھندلا پن آئے تو فوراً بی ایچ یو (BHU) جا کر بلڈ پریشر چیک کروائیں۔`;
    }
    return `Headache & Blood Pressure Guidance (Week ${pregnancyWeek}):\n\n` +
      `• **Clinical Context:** Persistent headache after 20 weeks can be a warning sign of gestational hypertension or pre-eclampsia.\n` +
      `• **Recommended Action:** Rest in a dark, quiet room and drink water. If the headache is severe, unremitting, or accompanied by vision changes or upper abdominal pain, visit your nearest BHU/RHC clinic immediately for a BP test.`;
  }

  // 6. Vomiting / Nausea / Morning Sickness
  if (q.includes("vomit") || q.includes("nausea") || q.includes("sick") || q.includes("الٹی")) {
    if (language === "urdu") {
      return `حمل میں متلی اور الٹی کی شکایت (حمل کا ہفتہ ${pregnancyWeek}):\n\n` +
        `• **تدابیر:** صبح اٹھ کر خشک بسکٹ یا ٹوسٹ کھائیں۔ دن میں 5 سے 6 چھوٹے کھانے کھائیں اور چکنائی والی غذاؤں سے پرہیز کریں۔ الائچی يا ادرک کی چائے سے افاقہ ہوتا ہے۔\n` +
        `• **ڈاکٹر سے کب ملیں:** اگر 24 گھنٹے سے کچھ بھی نہ ٹھہر رہا ہو، شدید کمزوری ہو یا پیشاب بالکل نہ آ رہا ہو تو بی ایچ یو سے زچگی کی محفوظ دوا لیں۔`;
    }
    return `Nausea & Vomiting Management (Week ${pregnancyWeek}):\n\n` +
      `• **Self-Care Tips:** Eat small, frequent meals (5-6 times daily) rather than large heavy meals. Avoid oily, spicy foods. Ginger tea or dry toast in the morning helps ease nausea.\n` +
      `• **When to Seek Care:** If you cannot keep fluids down for over 24 hours, feel faint, or notice dark sparse urine, visit your local BHU for pregnancy-safe anti-emetic care and hydration support.`;
  }

  // Generic fallback if query topic is unique
  const matched = findRelevantConditions(query);
  if (matched.length > 0) {
    const main = matched[0];
    if (language === "urdu") {
      return `حمل کے ${pregnancyWeek}ویں ہفتے میں **${main.condition_name}** سے متعلق ضروری معلومات:\n\n` +
        `• **مجوزہ تدابیر:** ${main.medical_management.slice(0, 2).join(". ")}۔ روزانہ 8-10 گلاس پانی پیئیں اور بائیں کروٹ آرام کریں۔\n\n` +
        `⚠️ **خطرناک علامات:** ${main.emergency_signs.join("، ")}۔ اگر یہ تکلیف ہو تو فوراً بی ایچ یو یا ہسپتال رجوع کریں۔`;
    }
    return `Regarding your concern about **${main.condition_name}** at week ${pregnancyWeek}:\n\n` +
      `• **Recommended Steps:** ${main.medical_management.join(". ")}. Maintain good hydration (8-10 glasses of water), sleep on your left side, and take daily prenatal vitamins.\n\n` +
      `⚠️ **Red Flags:** ${main.emergency_signs.join(", ")}. If you experience these severe signs, visit your nearest BHU/RHC clinic right away.`;
  }

  // Ultimate fallback
  if (language === "urdu") {
    return `السلام علیکم۔ حمل کے ${pregnancyWeek}ویں ہفتے میں آپ کے سوال ("${query}") کے حوالے سے:\n\n` +
      `• روزانہ 8 سے 10 گلاس صاف پانی پیئیں، متوازن غذا (دالیں، پالک، دہی، انڈے) کھائیں اور آئرن کی گولی لیں۔\n` +
      `• اگر شدید درد، خون آنا، یا بچے کی حرکت کم ہو تو فوراً قریبی بی ایچ یو (BHU) یا ڈاکٹر سے رجوع کریں۔`;
  }

  return `Regarding your inquiry ("${query}") at week ${pregnancyWeek} of pregnancy:\n\n` +
    `• Keep up good daily habits: drink 8-10 glasses of clean water, eat nutrient-dense meals (lentils, spinach, milk, eggs), take your daily Iron/Folic acid tablets, and get adequate rest.\n` +
    `• Seek urgent medical evaluation at your local BHU/THQ clinic if you experience warning signs like severe abdominal pain, vaginal bleeding, or reduced baby movements (<10 kicks in 2 hours).`;
}

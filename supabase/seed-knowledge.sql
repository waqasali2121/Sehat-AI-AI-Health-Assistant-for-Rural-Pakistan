-- Sehat AI: Seed Data for Doctor Knowledge Base
-- Run this in Supabase SQL Editor after running schema.sql

INSERT INTO public.doctor_knowledge (topic, category, content, content_urdu, trimester, tags) VALUES

-- ============================================================
-- 1. HYPEREMESIS GRAVIDARUM
-- ============================================================
(
  'Hyperemesis Gravidarum',
  'prenatal',
  'DEFINITION: A severe form of pregnancy nausea and vomiting causing dehydration, weight loss, and nutritional imbalance.

STAGE: First trimester, may continue into later pregnancy.

SYMPTOMS: Severe vomiting, unable to tolerate food or fluids, weight loss, weakness, dizziness, reduced urination.

RISK FACTORS: Previous hyperemesis pregnancy, multiple pregnancy, molar pregnancy, history of severe morning sickness.

MATERNAL COMPLICATIONS: Dehydration, electrolyte imbalance, malnutrition, kidney problems.

BABY COMPLICATIONS: Low birth weight, poor fetal growth.

DIAGNOSIS: Clinical assessment, urine ketones, blood electrolyte tests, weight monitoring, ultrasound.

MANAGEMENT: Oral hydration, IV fluids if severe, pregnancy-safe anti-vomiting medicines, nutritional support, hospital admission if required.

EMERGENCY SIGNS: Cannot drink fluids, severe weakness, fainting, blood in vomit.

PREVENTION: Early pregnancy care, small frequent meals, adequate hydration.

RECOMMENDATION: Women with persistent vomiting should consult an obstetrician.',
  'تعریف: حمل کی شدید متلی اور قے جو پانی کی کمی، وزن میں کمی اور غذائی عدم تواوازن کا سبب بنتی ہے۔

علامات: شدید قے، کھانا یا پانی برداشت نہ ہونا، وزن میں کمی، کمزوری، چکر آنا، پیشاب میں کمی۔

ہنگامی علامات: پانی نہ پی سکیں، شدید کمزوری، غش ہونا، قے میں خون۔

انتظام: منہ سے پانی پینا، شدید صورت میں آر وی، حمل میں محفوظ قے کی دوائیں، غذائی سپورٹ۔

سفارش: مسلسل قے والی خواتین ماہر امراض نسواں سے رجوع کریں۔',
  1,
  ARRAY['vomiting', 'nausea', 'dehydration', 'hyperemesis', 'first-trimester']
),

-- ============================================================
-- 2. ECTOPIC PREGNANCY
-- ============================================================
(
  'Ectopic Pregnancy',
  'emergency',
  'DEFINITION: A pregnancy that develops outside the uterus, commonly inside the fallopian tube.

STAGE: First trimester.

SYMPTOMS: One-sided abdominal pain, vaginal bleeding, shoulder pain, dizziness, fainting.

RISK FACTORS: Previous ectopic pregnancy, tubal surgery, pelvic infection, fertility treatment.

MATERNAL COMPLICATIONS: Internal bleeding, shock, life-threatening emergency.

BABY COMPLICATIONS: Pregnancy cannot continue normally.

DIAGNOSIS: Pregnancy hormone beta-hCG, transvaginal ultrasound.

MANAGEMENT: Medication (Methotrexate), surgical treatment if rupture occurs.

EMERGENCY SIGNS: Severe abdominal pain, collapse, heavy bleeding.

PREVENTION: Early pregnancy ultrasound, regular antenatal care.

RECOMMENDATION: Urgent obstetric evaluation required.',
  'تعریف: حمل جو رحم کے باہر نشوونما پائے، عام طور پر فالوپین ٹیوب میں۔

علامات: ایک طرف پیٹ درد، یونیجینل خون بہنا، کندھے کا درد، چکر آنا، غش ہونا۔

ہنگامی علامات: شدید پیٹ درد، گر جانا، شدید خون بہنا۔

انتظام: دوا (میتھوٹریکسیٹ)، پھٹنے کی صورت میں سرجری۔

سفارش: فوری ماہر امراض نسواں کا معائنہ ضروری ہے۔',
  1,
  ARRAY['ectopic', 'abdominal-pain', 'bleeding', 'emergency', 'first-trimester']
),

-- ============================================================
-- 3. MISCARRIAGE
-- ============================================================
(
  'Miscarriage (Spontaneous Abortion)',
  'emergency',
  'DEFINITION: Loss of pregnancy before fetal viability.

STAGE: Usually first trimester.

SYMPTOMS: Vaginal bleeding, abdominal cramps, tissue passing from vagina.

RISK FACTORS: Chromosomal abnormalities, maternal infections, hormonal problems, uterine abnormalities.

MATERNAL COMPLICATIONS: Heavy bleeding, infection, emotional distress.

BABY COMPLICATIONS: Pregnancy loss.

DIAGNOSIS: Ultrasound, pregnancy hormone monitoring.

MANAGEMENT: Expectant management, medication, surgical evacuation if required.

EMERGENCY SIGNS: Heavy bleeding, severe pain, fever.

PREVENTION: Healthy lifestyle, prenatal care.

RECOMMENDATION: Medical assessment required after bleeding during pregnancy.',
  'تعریف: حمل کا ضائع ہو جانا جب بچہ زندہ رہنے کے قابل نہ ہو۔

علامات: یونیجینل خون بہنا، پیٹ میں مروڑ، یونیجینل سے ٹشوز کا نکلنا۔

ہنگامی علامات: شدید خون بہنا، شدید درد، بخار۔

انتظام: انتظار سے علاج، دوا، ضرورت پر سرجیکل صفائی۔

سفارش: حمل کے دوران خون بہنے کے بعد طبی معائنہ ضروری ہے۔',
  1,
  ARRAY['miscarriage', 'bleeding', 'cramps', 'emergency', 'first-trimester']
);

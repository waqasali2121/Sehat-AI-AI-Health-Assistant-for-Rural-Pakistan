export type FacilityType = "BHU" | "RHC" | "THQ" | "DHQ";

export interface Facility {
  id: string;
  name: string;
  urduName: string;
  type: FacilityType;
  district: string;
  province: string;
  address: string;
  urduAddress: string;
  lat: number;
  lng: number;
  phone: string;
  emergencyAvailable: boolean;
  maternalCareAvailable: boolean;
  operatingHours: string;
  doctorOnDuty: string;
  lhwInCharge?: string;
  distanceKm?: number;
}

export interface ClinicBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  patientName: string;
  patientPhone: string;
  village: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED";
  createdAt: string;
}

export const PAKISTAN_FACILITIES: Facility[] = [
  {
    id: "bhu-42sb",
    name: "BHU Chak 42-SB",
    urduName: "بنیادی صحت مرکز چک 42 ایس بی",
    type: "BHU",
    district: "Sargodha",
    province: "Punjab",
    address: "Chak 42-SB, Tehsil Silanwali, Sargodha",
    urduAddress: "چک 42 ایس بی، تحصیل سلانوالی، سرگودھا",
    lat: 32.015,
    lng: 72.62,
    phone: "+92 300 4242111",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "8:00 AM - 4:00 PM (24/7 Maternity Emergency)",
    doctorOnDuty: "Dr. Samina Kausar (WMO)",
    lhwInCharge: "Nasreen Akhtar (LHW)",
  },
  {
    id: "bhu-36nb",
    name: "BHU Chak 36-NB",
    urduName: "بنیادی صحت مرکز چک 36 این بی",
    type: "BHU",
    district: "Sargodha",
    province: "Punjab",
    address: "Chak 36-NB, Sargodha Bypass Road",
    urduAddress: "چک 36 این بی، بائی پاس روڈ، سرگودھا",
    lat: 32.105,
    lng: 72.695,
    phone: "+92 301 3636222",
    emergencyAvailable: false,
    maternalCareAvailable: true,
    operatingHours: "8:00 AM - 2:00 PM",
    doctorOnDuty: "Dr. Farzana Bibi",
    lhwInCharge: "Kausar Parveen (LHW)",
  },
  {
    id: "rhc-midh",
    name: "RHC Midh Ranjha",
    urduName: "دیہی صحت مرکز مڈھ رانجھا",
    type: "RHC",
    district: "Sargodha",
    province: "Punjab",
    address: "Main Bhalwal Road, Midh Ranjha, Sargodha",
    urduAddress: "مین بھلوال روڈ، مڈھ رانجھا، سرگودھا",
    lat: 32.045,
    lng: 72.82,
    phone: "+92 302 8877123",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24 Hours Emergency & Labor Ward",
    doctorOnDuty: "Dr. Tariq Mahmood & Dr. Ayesha Khan",
    lhwInCharge: "Zubeda Khanum (Supervisor)",
  },
  {
    id: "thq-kotmomin",
    name: "THQ Hospital Kot Momin",
    urduName: "تحصیل ہیڈکوارٹر ہسپتال کوٹ مومن",
    type: "THQ",
    district: "Sargodha",
    province: "Punjab",
    address: "Hospital Road, Kot Momin, Sargodha",
    urduAddress: "ہسپتال روڈ، کوٹ مومن، سرگودھا",
    lat: 32.191,
    lng: 72.984,
    phone: "+92 48 6610234",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24/7 Complete Hospital & Gynae Emergency",
    doctorOnDuty: "Dr. Bushra Jabeen (Senior Gynecologist)",
  },
  {
    id: "thq-bhalwal",
    name: "THQ Hospital Bhalwal",
    urduName: "تحصیل ہیڈکوارٹر ہسپتال بھلوال",
    type: "THQ",
    district: "Sargodha",
    province: "Punjab",
    address: "Club Road, Bhalwal, Sargodha",
    urduAddress: "کلب روڈ، بھلوال، سرگودھا",
    lat: 32.264,
    lng: 72.898,
    phone: "+92 48 6642100",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24/7 Surgical & Obstetric Care",
    doctorOnDuty: "Dr. Nadia Riaz",
  },
  {
    id: "dhq-sargodha",
    name: "DHQ Teaching Hospital Sargodha",
    urduName: "ڈسٹرکٹ ہیڈکوارٹر ٹیچنگ ہسپتال سرگودھا",
    type: "DHQ",
    district: "Sargodha",
    province: "Punjab",
    address: "Faisalabad Road, Sargodha City",
    urduAddress: "فیصل آباد روڈ، سرگودھا شہر",
    lat: 32.084,
    lng: 72.671,
    phone: "+92 48 9230431",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24/7 Tertiary Maternal & Emergency Care",
    doctorOnDuty: "Prof. Dr. Tahira Parveen (Head of Gynae)",
  },
  {
    id: "bhu-manga",
    name: "BHU Manga Mandi",
    urduName: "بنیادی صحت مرکز مانگا منڈی",
    type: "BHU",
    district: "Lahore",
    province: "Punjab",
    address: "Multan Road, Manga Mandi, Lahore",
    urduAddress: "ملتان روڈ، مانگا منڈی، لاہور",
    lat: 31.305,
    lng: 74.07,
    phone: "+92 42 35380123",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "8:00 AM - 4:00 PM",
    doctorOnDuty: "Dr. Rabia Ahmed",
  },
  {
    id: "thq-raiwind",
    name: "THQ Hospital Raiwind",
    urduName: "تحصیل ہیڈکوارٹر ہسپتال رائوند",
    type: "THQ",
    district: "Lahore",
    province: "Punjab",
    address: "Sundar Road, Raiwind, Lahore",
    urduAddress: "سندر روڈ، رائوند، لاہور",
    lat: 31.25,
    lng: 74.215,
    phone: "+92 42 35391022",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24 Hours Emergency",
    doctorOnDuty: "Dr. Sadia Noor",
  },
  {
    id: "rhc-mandra",
    name: "RHC Mandra",
    urduName: "دیہی صحت مرکز مندرہ",
    type: "RHC",
    district: "Rawalpindi",
    province: "Punjab",
    address: "GT Road, Mandra, Tehsil Gujar Khan, Rawalpindi",
    urduAddress: "جی ٹی روڈ، مندرہ، تحصیل گجر خان، راولپنڈی",
    lat: 33.25,
    lng: 73.14,
    phone: "+92 51 3590111",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24/7 Maternity & Ambulance Base",
    doctorOnDuty: "Dr. Naureen Fatima",
  },
  {
    id: "bhu-charsadda",
    name: "BHU Utmanzai",
    urduName: "بنیادی صحت مرکز اتمان زئی",
    type: "BHU",
    district: "Charsadda",
    province: "KPK",
    address: "Main Bazar, Utmanzai, Charsadda",
    urduAddress: "مین بازار، اتمان زئی، چارسدہ",
    lat: 34.148,
    lng: 71.73,
    phone: "+92 91 6512344",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "8:00 AM - 3:00 PM",
    doctorOnDuty: "Dr. Gul-e-Lala",
  },
  {
    id: "rhc-thatta",
    name: "RHC Makli",
    urduName: "دیہی صحت مرکز مکلی",
    type: "RHC",
    district: "Thatta",
    province: "Sindh",
    address: "National Highway, Makli, Thatta",
    urduAddress: "قومی شاہراہ، مکلی، ٹھٹہ",
    lat: 24.747,
    lng: 67.923,
    phone: "+92 298 770122",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "24 Hours Emergency",
    doctorOnDuty: "Dr. Shabana Solangi",
  },
  {
    id: "bhu-mastung",
    name: "BHU Kanak",
    urduName: "بنیادی صحت مرکز کڑک",
    type: "BHU",
    district: "Mastung",
    province: "Balochistan",
    address: "RCD Highway, Kanak Valley, Mastung",
    urduAddress: "آر سی ڈی شاہراہ، کڑک وادی، مستونگ",
    lat: 29.799,
    lng: 66.845,
    phone: "+92 843 891033",
    emergencyAvailable: true,
    maternalCareAvailable: true,
    operatingHours: "8:00 AM - 2:00 PM",
    doctorOnDuty: "Dr. Bibi Maryam",
  },
];

// Haversine Distance Formula in Kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

// Default reference location (Sargodha rural district)
export const DEFAULT_USER_LOCATION = {
  lat: 32.0836,
  lng: 72.6711,
  name: "Sargodha District",
};

export function getFacilitiesSortedByDistance(
  userLat: number = DEFAULT_USER_LOCATION.lat,
  userLng: number = DEFAULT_USER_LOCATION.lng
): Facility[] {
  return PAKISTAN_FACILITIES.map((facility) => ({
    ...facility,
    distanceKm: calculateDistance(userLat, userLng, facility.lat, facility.lng),
  })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
}

const BOOKINGS_STORAGE_KEY = "sehat_ai_clinic_bookings";

export function getBookings(): ClinicBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveBooking(booking: Omit<ClinicBooking, "id" | "createdAt" | "status">): ClinicBooking {
  const newBooking: ClinicBooking = {
    ...booking,
    id: `BK-${Date.now().toString().slice(-6)}`,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const existing = getBookings();
    existing.unshift(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(existing));
  }
  return newBooking;
}

export function getMapUrl(facility: Facility, userLat?: number, userLng?: number): string {
  if (userLat && userLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${facility.lat},${facility.lng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${facility.lat},${facility.lng}`;
}

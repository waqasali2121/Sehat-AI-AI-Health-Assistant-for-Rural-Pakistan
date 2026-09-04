"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import {
  getAllPatientRecords,
  isAdminLoggedIn,
  setAdminSession,
  PatientRecord,
  SymptomFormSubmission,
  getRiskLevel,
  extractConditionsFromChat,
} from "@/lib/patient-store";
import { getBookings, ClinicBooking } from "@/lib/facilities";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [bookings, setBookings] = useState<ClinicBooking[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [selectedForm, setSelectedForm] = useState<SymptomFormSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [activeTab, setActiveTab] = useState<"PATIENTS" | "FORMS" | "BOOKINGS">("PATIENTS");

  useEffect(() => {
    const logged = isAdminLoggedIn();
    setIsLoggedIn(logged);
    if (logged) {
      loadAdminData();
    }
  }, []);

  const loadAdminData = () => {
    setRecords(getAllPatientRecords());
    setBookings(getBookings());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "AISehatadmin@app.com" && password === "Admin@123") {
      setAdminSession(true);
      setIsLoggedIn(true);
      setAuthError("");
      loadAdminData();
    } else {
      setAuthError("Invalid Admin credentials. Please check email and password.");
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  // Filter logic
  const filteredRecords = records.filter((rec) => {
    const risk = getRiskLevel(rec.chatHistory);
    if (filterRisk !== "ALL" && risk !== filterRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rec.patient.fullName.toLowerCase().includes(q);
      const matchPhone = rec.patient.phone.toLowerCase().includes(q);
      const matchVillage = rec.patient.village.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchVillage) return false;
    }
    return true;
  });

  const allSubmissions: Array<{ record: PatientRecord; form: SymptomFormSubmission }> = [];
  records.forEach((r) => {
    if (r.symptomFormSubmissions) {
      r.symptomFormSubmissions.forEach((f) => {
        allSubmissions.push({ record: r, form: f });
      });
    }
  });

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <AppHeader subtitle="Admin Portal" />

        <main className="flex-1 w-full max-w-lg mx-auto pt-28 pb-32 px-margin-mobile flex flex-col justify-center">
          <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/60 p-inset-lg flex flex-col gap-stack-md shadow-lg">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-md">
                <Icon name="admin_panel_settings" className="text-headline-md" />
              </span>
              <h1 className="font-headline-sm font-extrabold text-on-surface">
                Sehat AI Admin Login
              </h1>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Enter your administrative credentials to manage patient records, health cards, and clinical submissions.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div>
                <label className="block font-label-sm font-bold text-on-surface text-xs mb-1">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="AISehatadmin@app.com"
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-sm font-bold text-on-surface text-xs mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2.5 font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {authError && (
                <div className="rounded-xl bg-error-container p-inset-sm text-xs font-semibold text-on-error-container flex items-center gap-1.5">
                  <Icon name="error" className="text-body-md" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-touch-min flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-md active:scale-[0.98] transition-transform py-3 mt-2"
              >
                <Icon name="lock_open" className="text-xl" />
                Login to Admin Console
              </button>
            </form>

            <div className="rounded-xl bg-surface-container-low p-2 text-center text-[11px] text-outline border border-outline-variant/30">
              Authorized admin use only · Contact system administrator for credentials
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Admin Portal Console" />

      <main className="flex-1 w-full max-w-lg mx-auto pt-24 pb-32 px-margin-mobile flex flex-col gap-stack-md">
        {/* Admin Bar Header */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-container to-primary-fixed p-inset-md border border-primary/20 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
                <Icon name="security" className="text-headline-sm" />
              </span>
              <div>
                <h1 className="font-label-lg text-label-lg font-bold text-on-surface">
                  Sehat AI Clinical Admin Console
                </h1>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Logged in as <strong className="text-primary">AISehatadmin@app.com</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-secondary-container px-3 py-1 font-label-sm text-xs font-bold text-on-secondary-container active:scale-95 transition-transform"
            >
              Logout
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-surface-container-lowest p-2 text-center border border-outline-variant/40">
              <p className="font-headline-sm font-extrabold text-primary">{records.length}</p>
              <p className="font-label-sm text-[11px] text-on-surface-variant font-semibold">Patients</p>
            </div>
            <div className="rounded-xl bg-surface-container-lowest p-2 text-center border border-outline-variant/40">
              <p className="font-headline-sm font-extrabold text-tertiary">{allSubmissions.length}</p>
              <p className="font-label-sm text-[11px] text-on-surface-variant font-semibold">15-Sec Forms</p>
            </div>
            <div className="rounded-xl bg-surface-container-lowest p-2 text-center border border-outline-variant/40">
              <p className="font-headline-sm font-extrabold text-secondary">{bookings.length}</p>
              <p className="font-label-sm text-[11px] text-on-surface-variant font-semibold">BHU Visits</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-surface-container-low p-1 border border-outline-variant/40">
          <button
            type="button"
            onClick={() => setActiveTab("PATIENTS")}
            className={`flex-1 py-2 font-label-md text-xs font-bold rounded-lg transition-all ${
              activeTab === "PATIENTS"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            All Patients ({filteredRecords.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("FORMS")}
            className={`flex-1 py-2 font-label-md text-xs font-bold rounded-lg transition-all ${
              activeTab === "FORMS"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Symptom Forms ({allSubmissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("BOOKINGS")}
            className={`flex-1 py-2 font-label-md text-xs font-bold rounded-lg transition-all ${
              activeTab === "BOOKINGS"
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Clinic Bookings ({bookings.length})
          </button>
        </div>

        {/* Search & Risk Filter */}
        {activeTab === "PATIENTS" && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-md"
              />
              <input
                type="text"
                placeholder="Search patient name, phone, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest pl-9 pr-3 py-2 font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((risk) => (
                <button
                  key={risk}
                  type="button"
                  onClick={() => setFilterRisk(risk)}
                  className={`rounded-full px-3 py-1 font-label-sm text-[11px] font-bold shrink-0 transition-colors ${
                    filterRisk === risk
                      ? risk === "HIGH"
                        ? "bg-secondary text-on-secondary"
                        : risk === "MEDIUM"
                        ? "bg-tertiary text-on-tertiary"
                        : "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface"
                  }`}
                >
                  {risk === "ALL" ? "All Risk Levels" : `${risk} Risk`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: PATIENTS LIST */}
        {activeTab === "PATIENTS" && (
          <div className="flex flex-col gap-stack-sm">
            {filteredRecords.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-inset-lg text-center text-on-surface-variant text-xs">
                No patient records found.
              </div>
            ) : (
              filteredRecords.map((record) => {
                const risk = getRiskLevel(record.chatHistory);
                const conditions = extractConditionsFromChat(record.chatHistory);
                const formCount = record.symptomFormSubmissions?.length || 0;

                return (
                  <div
                    key={record.id}
                    className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-sm font-bold text-primary text-xs">
                            {record.id}
                          </span>
                          <h3 className="font-label-lg font-bold text-on-surface">
                            {record.patient.fullName || "Unnamed Patient"}
                          </h3>
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant">
                          Age: {record.patient.age || "--"} | Blood Group: {record.patient.bloodGroup || "--"} | Week: {record.patient.gestationalWeek || "--"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 font-label-sm text-[11px] font-bold uppercase shrink-0 ${
                          risk === "HIGH"
                            ? "bg-secondary-container text-on-secondary-container"
                            : risk === "MEDIUM"
                            ? "bg-tertiary-container text-on-tertiary-container"
                            : "bg-primary-container text-on-primary-container"
                        }`}
                      >
                        {risk} Risk
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-2">
                      <p>
                        <strong>Phone:</strong> {record.patient.phone || "Not specified"}
                      </p>
                      <p>
                        <strong>Location:</strong> {record.patient.village || "Rural Area"}
                      </p>
                      <p>
                        <strong>LHW:</strong> {record.patient.lhwName || "Not assigned"} ({record.patient.lhwPhone || "N/A"})
                      </p>
                      {conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {conditions.map((c) => (
                            <span
                              key={c}
                              className="rounded bg-tertiary-container/40 px-2 py-0.5 font-semibold text-on-tertiary-container text-[11px]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/30">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(record)}
                        className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl border border-primary text-primary font-label-md text-xs font-bold active:scale-95 transition-transform"
                      >
                        <Icon name="visibility" className="text-sm" />
                        View Full Profile
                      </button>
                      <Link
                        href="/health-card"
                        className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold active:scale-95 transition-transform"
                      >
                        <Icon name="badge" className="text-sm" />
                        View Health Card
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: SUBMITTED 15-SECTION SYMPTOM FORMS */}
        {activeTab === "FORMS" && (
          <div className="flex flex-col gap-stack-sm">
            {allSubmissions.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-inset-lg text-center text-on-surface-variant text-xs">
                No 15-section symptom checker forms submitted yet.
              </div>
            ) : (
              allSubmissions.map(({ record, form }) => (
                <div
                  key={form.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm font-bold text-primary text-xs">{form.id}</span>
                    <span className="text-[11px] text-outline">
                      {new Date(form.timestamp).toLocaleDateString()} at {new Date(form.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-headline-sm font-bold text-on-surface">{form.patientName}</h3>
                  <div className="flex flex-col gap-1 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-2">
                    <p>
                      <strong>Age & Phone:</strong> {form.age} yrs | {form.phone}
                    </p>
                    <p>
                      <strong>Trimester:</strong> {form.trimester} weeks | <strong>Blood Group:</strong> {form.bloodGroup}
                    </p>
                    <p>
                      <strong>BP Status:</strong> {form.bpStatus} ({form.bpSystolic}/{form.bpDiastolic})
                    </p>
                    <p>
                      <strong>Hemoglobin:</strong> {form.hemoglobin} | <strong>Urine Result:</strong> {form.urineResult}
                    </p>
                    {form.hasEmergency && (
                      <span className="rounded-md bg-secondary-container text-on-secondary-container px-2 py-0.5 text-[11px] font-bold w-fit mt-1">
                        ⚠️ Emergency Warning Triggered
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedForm(form)}
                    className="min-h-touch-min flex items-center justify-center gap-1 rounded-xl bg-surface-container-high text-on-surface font-label-md text-xs font-bold active:scale-95 transition-transform mt-1"
                  >
                    <Icon name="assignment" className="text-sm" />
                    Inspect All 15 Form Answers
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: CLINIC BOOKINGS */}
        {activeTab === "BOOKINGS" && (
          <div className="flex flex-col gap-stack-sm">
            {bookings.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-inset-lg text-center text-on-surface-variant text-xs">
                No clinic visits booked yet.
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm font-bold text-primary text-xs">{b.id}</span>
                    <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
                      {b.status}
                    </span>
                  </div>

                  <h3 className="font-headline-sm font-bold text-on-surface">{b.facilityName}</h3>
                  <div className="flex flex-col gap-1 text-xs text-on-surface-variant border-t border-outline-variant/30 pt-2">
                    <p>
                      <strong>Patient:</strong> {b.patientName} ({b.patientPhone})
                    </p>
                    <p>
                      <strong>Village:</strong> {b.village}
                    </p>
                    <p>
                      <strong>Appointment:</strong> {b.date} at {b.timeSlot}
                    </p>
                    <p>
                      <strong>Reason:</strong> {b.reason}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Patient Profile Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-inset-md">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-inset-md flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                <h2 className="font-headline-sm font-bold text-on-surface">
                  Patient File: {selectedRecord.patient.fullName}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-full p-1 text-outline hover:text-on-surface"
                >
                  <Icon name="close" className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-xs text-on-surface">
                <div className="rounded-xl bg-surface-container-low p-2.5 flex flex-col gap-1">
                  <p><strong>Record ID:</strong> {selectedRecord.id}</p>
                  <p><strong>Age:</strong> {selectedRecord.patient.age} years</p>
                  <p><strong>Phone:</strong> {selectedRecord.patient.phone}</p>
                  <p><strong>Village:</strong> {selectedRecord.patient.village}</p>
                  <p><strong>Gestational Week:</strong> Week {selectedRecord.patient.gestationalWeek}</p>
                  <p><strong>Due Date:</strong> {selectedRecord.patient.expectedDueDate}</p>
                </div>

                <div className="rounded-xl bg-surface-container-low p-2.5 flex flex-col gap-1">
                  <p className="font-bold text-primary">Emergency & LHW Contacts:</p>
                  <p><strong>Emergency:</strong> {selectedRecord.patient.emergencyContactName} ({selectedRecord.patient.emergencyContactPhone})</p>
                  <p><strong>LHW:</strong> {selectedRecord.patient.lhwName} ({selectedRecord.patient.lhwPhone})</p>
                </div>

                <div className="rounded-xl bg-surface-container-low p-2.5 flex flex-col gap-1">
                  <p className="font-bold text-primary">AI Doctor Chat History ({selectedRecord.chatHistory.length}):</p>
                  {selectedRecord.chatHistory.length === 0 ? (
                    <p className="text-outline">No consultations recorded.</p>
                  ) : (
                    selectedRecord.chatHistory.map((c) => (
                      <div key={c.id} className="border-t border-outline-variant/30 pt-1">
                        <p className="font-semibold">Q: {c.userMessage}</p>
                        <p className="text-on-surface-variant">A: {c.aiResponse.slice(0, 100)}...</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 15-Section Form Answers Inspector Modal */}
        {selectedForm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-inset-md">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-inset-md flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
                <h2 className="font-headline-sm font-bold text-on-surface">
                  Form Inspection: {selectedForm.id}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedForm(null)}
                  className="rounded-full p-1 text-outline hover:text-on-surface"
                >
                  <Icon name="close" className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col gap-2 text-xs text-on-surface">
                <p><strong>Patient:</strong> {selectedForm.patientName} (Age: {selectedForm.age})</p>
                <p><strong>Trimester/Week:</strong> {selectedForm.trimester} weeks</p>
                <p><strong>BP Check:</strong> {selectedForm.bpStatus} ({selectedForm.bpSystolic}/{selectedForm.bpDiastolic})</p>
                <p><strong>Weight:</strong> Current: {selectedForm.currentWeight}kg | Pre: {selectedForm.preWeight}kg ({selectedForm.weightChange})</p>
                <p><strong>Ultrasound:</strong> {selectedForm.ultrasoundDone ? "Done" : "Not done"} | Heartbeat: {selectedForm.babyHeartbeat} | Growth: {selectedForm.babyMovement}</p>
                <p><strong>Blood Tests:</strong> Hb: {selectedForm.hemoglobin} | Sugar: {selectedForm.bloodSugar} | Infections: {selectedForm.infections.join(", ")}</p>
                <p><strong>Urine Test:</strong> {selectedForm.urineResult}</p>
                <p><strong>Vaginal Health:</strong> {selectedForm.vaginalSymptoms.join(", ")}</p>
                <p><strong>Medical History:</strong> {selectedForm.medicalHistory.join(", ")}</p>
                <p><strong>Medicines:</strong> {selectedForm.medicines.join(", ")}</p>
                <p><strong>High Risk Conditions:</strong> {selectedForm.highRiskConditions.join(", ")}</p>
                <p><strong>Doctor Advised:</strong> {selectedForm.doctorAdvised.join(", ")}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

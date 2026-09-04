"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Icon } from "@/components/icon";
import {
  Facility,
  FacilityType,
  PAKISTAN_FACILITIES,
  getFacilitiesSortedByDistance,
  saveBooking,
  getMapUrl,
  ClinicBooking,
  getBookings,
  DEFAULT_USER_LOCATION,
} from "@/lib/facilities";
import { getPatientRecord } from "@/lib/patient-store";

export default function ClinicsPage() {
  // Geolocation state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationName, setLocationName] = useState<string>("Sargodha Rural District (Default)");
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filter state
  const [filterType, setFilterType] = useState<FacilityType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Modal / Booking state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("10:00 AM");
  const [bookingReason, setBookingReason] = useState<string>("Routine Antenatal Checkup (زچگی کا معمول کا معائنہ)");
  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [village, setVillage] = useState<string>("");

  const [bookingConfirmed, setBookingConfirmed] = useState<ClinicBooking | null>(null);
  const [myBookings, setMyBookings] = useState<ClinicBooking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);

  // Initialize patient data from local store
  useEffect(() => {
    const record = getPatientRecord();
    if (record.patient) {
      if (record.patient.fullName) setPatientName(record.patient.fullName);
      if (record.patient.phone) setPatientPhone(record.patient.phone);
      if (record.patient.village) setVillage(record.patient.village);
    }
    setMyBookings(getBookings());

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Request browser GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setLocationName(`Your GPS Location (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})`);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Showing default Sargodha district.");
        } else {
          setLocationError("Unable to retrieve location. Using regional defaults.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const currentLat = userCoords?.lat ?? DEFAULT_USER_LOCATION.lat;
  const currentLng = userCoords?.lng ?? DEFAULT_USER_LOCATION.lng;

  // Facilities sorted by distance
  const sortedFacilities = getFacilitiesSortedByDistance(currentLat, currentLng);

  // Apply filters
  const filteredFacilities = sortedFacilities.filter((facility) => {
    if (filterType !== "ALL" && facility.type !== filterType) return false;
    if (emergencyOnly && !facility.emergencyAvailable) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = facility.name.toLowerCase().includes(q);
      const matchUrdu = facility.urduName.includes(q);
      const matchDistrict = facility.district.toLowerCase().includes(q);
      const matchAddress = facility.address.toLowerCase().includes(q);
      if (!matchName && !matchUrdu && !matchDistrict && !matchAddress) return false;
    }
    return true;
  });

  const nearestFacility = sortedFacilities[0];

  const handleOpenBooking = (facility: Facility) => {
    setSelectedFacility(facility);
    setBookingConfirmed(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;

    const newBooking = saveBooking({
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      patientName: patientName || "Valued Patient",
      patientPhone: patientPhone || "+92 300 0000000",
      village: village || "Rural Area",
      date: bookingDate,
      timeSlot: bookingTime,
      reason: bookingReason,
    });

    setBookingConfirmed(newBooking);
    setMyBookings(getBookings());
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <AppHeader subtitle="Nearest BHU / Clinic / Hospital" />

      <main className="flex-1 w-full max-w-lg mx-auto pt-24 pb-32 px-margin-mobile flex flex-col gap-stack-md">
        {/* Hero Banner with Location Trigger */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-container/80 to-primary-fixed p-inset-md border border-primary/20 flex flex-col gap-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
                <Icon name="near_me" className="text-headline-sm" />
              </span>
              <div>
                <h1 className="font-label-lg text-label-lg font-bold text-on-surface">
                  Find Nearest Clinic / BHU
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  قریب ترین بی ایچ یو یا ہسپتال تلاش کریں
                </p>
              </div>
            </div>
          </div>

          {/* Current Location Badge & GPS Button */}
          <div className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest/90 p-inset-sm border border-outline-variant/40">
            <div className="flex items-center justify-between text-body-sm text-on-surface">
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon name="location_on" className="text-primary shrink-0 text-body-md" />
                <span className="font-semibold truncate">{locationName}</span>
              </div>
              {userCoords && (
                <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[11px] font-bold text-on-tertiary-container shrink-0">
                  GPS Active
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={locating}
              className="w-full min-h-touch-min flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Icon
                name={locating ? "sync" : "my_location"}
                className={`text-body-lg ${locating ? "animate-spin" : ""}`}
              />
              <span>
                {locating ? "Detecting GPS Location..." : "Use My Current GPS Location (موقعی مقام)"}
              </span>
            </button>
            {locationError && (
              <p className="font-body-sm text-xs text-secondary px-1">{locationError}</p>
            )}
          </div>
        </div>

        {/* Nearest Top Highlight (Quick Booking) */}
        {nearestFacility && (
          <div className="rounded-2xl bg-tertiary-container/30 border-2 border-tertiary/40 p-inset-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary px-inset-sm py-0.5 font-label-sm text-xs font-bold text-on-tertiary">
                <Icon name="stars" className="text-sm" />
                Nearest Facility (سب سے قریب)
              </span>
              <span className="font-headline-sm font-extrabold text-tertiary">
                {nearestFacility.distanceKm} km away
              </span>
            </div>

            <div>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                {nearestFacility.name}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {nearestFacility.urduName}
              </p>
              <p className="font-body-sm text-xs text-outline mt-1">{nearestFacility.address}</p>
            </div>

            <div className="flex flex-wrap items-center gap-inset-xs text-body-sm text-on-surface">
              <span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-1 font-label-sm text-xs">
                <Icon name="schedule" className="text-primary text-sm" />
                {nearestFacility.operatingHours}
              </span>
              {nearestFacility.doctorOnDuty && (
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-container px-2 py-1 font-label-sm text-xs">
                  <Icon name="stethoscope" className="text-primary text-sm" />
                  {nearestFacility.doctorOnDuty}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={getMapUrl(nearestFacility, currentLat, currentLng)}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-touch-min flex items-center justify-center gap-1.5 rounded-xl border border-primary text-primary bg-surface-container-lowest font-label-md text-label-md font-bold active:scale-95 transition-transform"
              >
                <Icon name="map" className="text-body-lg" />
                <span>Map Route (نقشہ)</span>
              </a>
              <button
                type="button"
                onClick={() => handleOpenBooking(nearestFacility)}
                className="min-h-touch-min flex items-center justify-center gap-1.5 rounded-xl bg-tertiary text-on-tertiary font-label-md text-label-md font-bold active:scale-95 transition-transform"
              >
                <Icon name="calendar_month" className="text-body-lg" />
                <span>Book Visit (وقت لیں)</span>
              </button>
            </div>
          </div>
        )}

        {/* View Toggle: All Clinics vs My Bookings */}
        <div className="flex rounded-xl bg-surface-container-low p-1 border border-outline-variant/40">
          <button
            type="button"
            onClick={() => setShowMyBookings(false)}
            className={`flex-1 py-2 font-label-md text-label-md font-bold rounded-lg transition-all ${
              !showMyBookings
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            All Clinics ({filteredFacilities.length})
          </button>
          <button
            type="button"
            onClick={() => setShowMyBookings(true)}
            className={`flex-1 py-2 font-label-md text-label-md font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
              showMyBookings
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span>My Bookings</span>
            {myBookings.length > 0 && (
              <span className="rounded-full bg-primary text-on-primary px-1.5 py-0.2 text-[10px] font-bold">
                {myBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* My Bookings View */}
        {showMyBookings ? (
          <div className="flex flex-col gap-3">
            {myBookings.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest p-inset-lg text-center flex flex-col items-center gap-2 border border-outline-variant/60">
                <Icon name="event_busy" className="text-headline-lg text-outline" />
                <h3 className="font-label-lg font-bold text-on-surface">No Clinic Visits Booked</h3>
                <p className="font-body-sm text-on-surface-variant">
                  آپ کا کوئی بکنگ ریکارڈ نہیں ہے۔ آپ کسی بھی بی ایچ یو میں وقت لے سکتے ہیں۔
                </p>
                <button
                  type="button"
                  onClick={() => setShowMyBookings(false)}
                  className="mt-2 rounded-xl bg-primary px-inset-md py-inset-sm font-label-md text-on-primary font-bold"
                >
                  Browse Facilities
                </button>
              </div>
            ) : (
              myBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm font-bold text-primary">{b.id}</span>
                    <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-xs font-bold text-on-tertiary-container">
                      {b.status}
                    </span>
                  </div>

                  <h3 className="font-headline-sm font-bold text-on-surface">{b.facilityName}</h3>
                  <div className="flex flex-col gap-1 text-body-sm text-on-surface-variant border-t border-outline-variant/40 pt-2">
                    <p>
                      <strong>Patient:</strong> {b.patientName} ({b.patientPhone})
                    </p>
                    <p>
                      <strong>Date & Time:</strong> {b.date} at {b.timeSlot}
                    </p>
                    <p>
                      <strong>Reason:</strong> {b.reason}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* All Clinics View */
          <div className="flex flex-col gap-stack-md">
            {/* Search & Filters */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg"
                />
                <input
                  type="text"
                  placeholder="Search clinic name, village, or district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-lowest pl-10 pr-4 py-2.5 font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    <Icon name="close" className="text-body-md" />
                  </button>
                )}
              </div>

              {/* Type pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {(["ALL", "BHU", "RHC", "THQ", "DHQ"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    className={`rounded-full px-inset-sm py-1 font-label-sm text-xs font-bold shrink-0 transition-colors ${
                      filterType === type
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface"
                    }`}
                  >
                    {type === "ALL"
                      ? "All Facilities"
                      : type === "BHU"
                      ? "BHU (بی ایچ یو)"
                      : type === "RHC"
                      ? "RHC (دیہی مرکز)"
                      : type === "THQ"
                      ? "THQ (تحصیل)"
                      : "DHQ (ڈسٹرکٹ)"}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setEmergencyOnly(!emergencyOnly)}
                  className={`rounded-full px-inset-sm py-1 font-label-sm text-xs font-bold shrink-0 transition-colors flex items-center gap-1 ${
                    emergencyOnly
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-high text-on-surface"
                  }`}
                >
                  <Icon name="emergency" className="text-xs" />
                  24/7 Emergency
                </button>
              </div>
            </div>

            {/* List of Facilities */}
            <div className="flex flex-col gap-stack-sm">
              {filteredFacilities.length === 0 ? (
                <div className="rounded-2xl bg-surface-container-lowest p-inset-lg text-center text-on-surface-variant">
                  No matching health facilities found. Try adjusting search or filters.
                </div>
              ) : (
                filteredFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 p-inset-md flex flex-col gap-3 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              facility.type === "BHU"
                                ? "bg-primary-container text-on-primary-container"
                                : facility.type === "RHC"
                                ? "bg-tertiary-container text-on-tertiary-container"
                                : "bg-secondary-container text-on-secondary-container"
                            }`}
                          >
                            {facility.type}
                          </span>
                          <h3 className="font-label-lg font-bold text-on-surface">
                            {facility.name}
                          </h3>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {facility.urduName}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-label-lg font-extrabold text-primary">
                          {facility.distanceKm} km
                        </span>
                        <span className="text-[11px] text-outline">from you</span>
                      </div>
                    </div>

                    <p className="font-body-sm text-xs text-on-surface-variant leading-snug">
                      <Icon name="location_on" className="text-primary text-xs inline mr-1" />
                      {facility.address}
                    </p>

                    <div className="flex flex-wrap gap-1.5 text-xs text-on-surface">
                      <span className="rounded bg-surface-container px-2 py-0.5">
                        🕒 {facility.operatingHours}
                      </span>
                      {facility.emergencyAvailable && (
                        <span className="rounded bg-tertiary-container px-2 py-0.5 font-semibold text-on-tertiary-container">
                          🚑 24/7 Emergency
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/30">
                      <a
                        href={getMapUrl(facility, currentLat, currentLng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-touch-min flex items-center justify-center gap-1.5 rounded-xl border border-outline-variant text-on-surface font-label-md text-xs font-bold hover:bg-surface-container-low transition-colors"
                      >
                        <Icon name="directions" className="text-primary text-base" />
                        <span>Map & Route</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(facility)}
                        className="min-h-touch-min flex items-center justify-center gap-1.5 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold active:scale-95 transition-transform"
                      >
                        <Icon name="calendar_month" className="text-base" />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {selectedFacility && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-inset-md flex flex-col gap-stack-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                <div>
                  <h2 className="font-headline-sm font-bold text-on-surface">
                    {bookingConfirmed ? "Booking Confirmed! ✅" : "Book Clinic Visit"}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {selectedFacility.name} ({selectedFacility.urduName})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFacility(null)}
                  className="rounded-full p-2 text-outline hover:text-on-surface hover:bg-surface-container"
                >
                  <Icon name="close" className="text-headline-sm" />
                </button>
              </div>

              {bookingConfirmed ? (
                /* Confirmation Screen */
                <div className="flex flex-col gap-stack-md py-2">
                  <div className="rounded-2xl bg-tertiary-container/40 p-inset-md text-center flex flex-col items-center gap-2 border border-tertiary/30">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary text-on-tertiary">
                      <Icon name="check_circle" className="text-headline-lg" />
                    </span>
                    <h3 className="font-headline-sm font-bold text-on-surface">
                      Appointment Registered!
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      آپ کا بی ایچ یو وزٹ کا وقت بک ہو چکا ہے۔
                    </p>
                    <div className="rounded-xl bg-surface-container-lowest px-inset-md py-2 font-mono text-label-lg font-bold text-primary">
                      Token #: {bookingConfirmed.id}
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface-container-low p-inset-md flex flex-col gap-2 font-body-sm text-on-surface">
                    <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
                      <span className="text-outline">Facility:</span>
                      <span className="font-semibold">{bookingConfirmed.facilityName}</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
                      <span className="text-outline">Patient:</span>
                      <span className="font-semibold">{bookingConfirmed.patientName}</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/30 pb-1.5">
                      <span className="text-outline">Date & Time:</span>
                      <span className="font-semibold">
                        {bookingConfirmed.date} at {bookingConfirmed.timeSlot}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-outline">Fee:</span>
                      <span className="font-bold text-tertiary">FREE (مفت زچگی کی سہولت)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={getMapUrl(selectedFacility, currentLat, currentLng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-touch-min flex items-center justify-center gap-1.5 rounded-xl border border-primary text-primary font-label-md font-bold"
                    >
                      <Icon name="directions" className="text-lg" />
                      Map Directions
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFacility(null);
                        setShowMyBookings(true);
                      }}
                      className="min-h-touch-min flex items-center justify-center gap-1.5 rounded-xl bg-primary text-on-primary font-label-md font-bold"
                    >
                      View My Bookings
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Screen */
                <form onSubmit={handleConfirmBooking} className="flex flex-col gap-stack-md">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block font-label-sm font-bold text-on-surface mb-1">
                        Patient Name (مریضہ کا نام)
                      </label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Fatima Bibi"
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2.5 font-body-md text-on-surface"
                      />
                    </div>

                    <div>
                      <label className="block font-label-sm font-bold text-on-surface mb-1">
                        Phone Number (فون نمبر)
                      </label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2.5 font-body-md text-on-surface"
                      />
                    </div>

                    <div>
                      <label className="block font-label-sm font-bold text-on-surface mb-1">
                        Village / Area (گاوں یا علاقہ)
                      </label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="e.g. Chak 42-SB"
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2.5 font-body-md text-on-surface"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-label-sm font-bold text-on-surface mb-1">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2.5 font-body-md text-on-surface"
                        />
                      </div>
                      <div>
                        <label className="block font-label-sm font-bold text-on-surface mb-1">
                          Time Slot
                        </label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-sm py-2.5 font-body-md text-on-surface"
                        >
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-sm font-bold text-on-surface mb-1">
                        Reason for Visit (معائنے کی وجہ)
                      </label>
                      <select
                        value={bookingReason}
                        onChange={(e) => setBookingReason(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-inset-md py-2.5 font-body-md text-on-surface"
                      >
                        <option value="Routine Antenatal Checkup (معمول کا چیک اپ)">
                          Routine Antenatal Checkup (معمول کا چیک اپ)
                        </option>
                        <option value="High Blood Pressure / Swelling (بلڈ پریشر / سوجن)">
                          High Blood Pressure / Swelling (بلڈ پریشر / سوجن)
                        </option>
                        <option value="Ultrasound / Scan Request (الٹراساؤنڈ)">
                          Ultrasound / Scan Request (الٹراساؤنڈ)
                        </option>
                        <option value="Vaccination & Supplements (ٹیٹوکس / دوا)">
                          Vaccination & Supplements (ٹیٹوکس / دوا)
                        </option>
                        <option value="Other Medical Issue (دیگر)">Other Medical Issue (دیگر)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-touch-min flex items-center justify-center gap-2 rounded-xl bg-primary text-on-primary font-label-lg font-bold shadow-md active:scale-[0.98] transition-transform py-3"
                  >
                    <Icon name="check" className="text-xl" />
                    Confirm Appointment (بکنگ کی تصدیق کریں)
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

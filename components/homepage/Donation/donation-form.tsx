"use client";

import Link from "next/link";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/supabase";
import { FastLoading } from "@/components/shared-component/fast-loading";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface DonationPayload {
  amount: number;
  frequency: "once" | "monthly";
  category: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

// ─── Payment Step ────────────────────────────────────────────────────────────
function PaymentStep({
  data,
  onBack,
  onSuccess,
  isSubmitting,
}: {
  data: DonationPayload;
  onBack: () => void;
  onSuccess: (screenshot: File, payload: DonationPayload) => void;
  isSubmitting: boolean;
}) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!screenshot) return;
    setSubmitted(true);
    onSuccess(screenshot, data);
  };

  if (submitted && isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FastLoading size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-black">Complete Your Donation</h2>
          <p className="text-xs text-black">Scan & Upload Screenshot</p>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-black"
        >
          <span className="text-xl leading-none">←</span>
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
        {/* Summary Card */}
        <div className="rounded-xl bg-cyan-50/50 border border-cyan-100 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-500">
            Donation Summary
          </p>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs">
            <span className="text-black">Amount</span>
            <span className="font-bold text-cyan-600 text-right text-sm">
              Rs. {data.amount.toLocaleString()}
            </span>
            <span className="text-black">Frequency</span>
            <span className="font-medium text-gray-700 text-right capitalize">
              {data.frequency === "once" ? "One-time" : "Monthly"}
            </span>
            <span className="text-black">Cause</span>
            <span className="font-medium text-gray-700 text-right">{data.category}</span>
            <span className="text-black">Name</span>
            <span className="font-medium text-gray-700 text-right">{data.name || "—"}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black">
            Scan to Pay via eSewa / Khalti
          </p>
          <div className="relative p-2 bg-white rounded-lg shadow-sm">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=lakshyadeep-donation-${data.amount}`}
              alt="Payment QR Code"
              className="h-32 w-32"
            />
          </div>
          <p className="mt-3 text-sm font-bold text-gray-700">
            Amount: Rs. {data.amount.toLocaleString()}
          </p>
        </div>

        {/* Screenshot Upload */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-black">
            Upload Payment Screenshot
          </p>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/20 p-4 hover:border-cyan-400 transition hover:bg-cyan-50/40">
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Screenshot preview"
                  className="max-h-40 rounded-lg object-contain shadow-sm"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                  <span className="text-white text-xs font-bold">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl">📎</span>
                </div>
                <span className="text-xs font-bold text-cyan-600 mb-1">
                  Click to upload screenshot
                </span>
                <span className="text-[10px] text-black italic">
                  PNG, JPG up to 5MB
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-6 space-y-2">
        <button
          onClick={handleSubmit}
          disabled={!screenshot || isSubmitting}
          className="w-full rounded-xl bg-cyan-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-100 transition hover:bg-cyan-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <FastLoading size="sm" variant="light" /> : "Confirm Payment"}
        </button>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full rounded-xl py-2.5 text-xs font-bold text-black hover:text-black transition"
        >
          Go Back to Form
        </button>
      </div>
    </div>
  );
}


// ─── Preset & Category Data ───────────────────────────────────────────────────
const PRESET_AMOUNTS = [2500, 5000, 10000];
const CATEGORIES = ["Education", "Clean Water", "Healthcare", "Where Needed Most"];

// ─── Main Donate Section ──────────────────────────────────────────────────────
function DonateSection() {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [category, setCategory] = useState("Education");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [step, setStep] = useState<"form" | "payment">("form");

  const totalAmount = customAmount
    ? parseInt(customAmount) || 0
    : selectedAmount ?? 0;

  const buildPayload = (): DonationPayload => ({
    amount: totalAmount,
    frequency,
    category,
    ...form,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [donationMessage, setDonationMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const donationFieldClass = (hasError: boolean) =>
    `w-full rounded-xl border-2 bg-gray-50/50 px-4 py-3 text-sm font-medium outline-none transition focus:bg-white ${hasError ? "border-red-400 focus:border-red-400" : "border-gray-100 focus:border-cyan-400"
    }`;

  const validateDonationForm = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.phone.trim()) errors.phone = "Phone number is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
    if (!totalAmount || totalAmount <= 0) errors.amount = "Select or enter a donation amount.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSuccess = async (screenshot: File, payload: DonationPayload) => {
    setIsSubmitting(true);
    setDonationMessage(null);
    try {
      const supabase = getSupabaseClient();

      // 1. Upload screenshot
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `donations/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('donation_payment_image_url')
        .upload(filePath, screenshot);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('donation_payment_image_url')
        .getPublicUrl(filePath);

      // 3. Insert donation record
      const { error: insertError } = await supabase
        .from('donations')
        .insert({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          amount: payload.amount,
          payment_method: payload.frequency === 'once' ? 'One-time' : 'Monthly',
          message: `Category: ${payload.category} | Address: ${payload.address}`,
          screenshot_url: publicUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setDonationMessage({
        type: "success",
        text: "Donation submitted successfully! We will verify your payment soon.",
      });
      setStep("form");
      setForm({ name: "", phone: "", email: "", address: "" });
      setCustomAmount("");
      setSelectedAmount(2500);
      setFieldErrors({});

    } catch (error: unknown) {
      console.error("Donation submission error:", error);
      const message = error && typeof error === "object" && "message" in error
        ? String((error as { message: string }).message)
        : "Unknown error";
      setDonationMessage({
        type: "error",
        text: `Failed to submit donation: ${message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full px-4 md:px-8 py-12">
        <section className="relative w-full overflow-hidden rounded-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/donation-img.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 grid min-h-[600px] grid-cols-1 items-center gap-8 px-8 py-14 lg:grid-cols-2 max-w-7xl mx-auto">
            {/* Left */}
            <div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Your Gift
              </h2>
              <h2
                // className="text-5xl font-bold text-brand leading-tight"
                className="text-brand font-light"
              >
                Changes Lives
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                Every dollar you give goes directly to communities that need it
                most — funding Education, clean water, healthcare, and sustainable
                livelihood across 32 countries.
              </p>
              <div className="mt-8 flex gap-4">
                <Link href="/donation/reports">
                  <button className="rounded-full cursor-pointer bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition">
                    View Reports
                  </button>
                </Link>
                {/* <button className="rounded-full border-2 border-white px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition">
                  Views Reports
                </button> */}
              </div>
            </div>

            {/* Right Column — Toggle between Form and Payment */}
            <div className="rounded-3xl bg-white p-6 lg:p-8 shadow-2xl relative min-h-[500px]">
              {donationMessage ? (
                <div
                  className={`mb-4 rounded-xl border px-4 py-3 text-sm ${donationMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-red-200 bg-red-50 text-red-800"
                    }`}
                >
                  {donationMessage.text}
                </div>
              ) : null}
              {step === "form" ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  {/* Tabs */}
                  <div className="mb-6 flex overflow-hidden rounded-2xl bg-gray-100 p-1">
                    {(["once", "monthly"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFrequency(f)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${frequency === f
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-black hover:text-gray-700"
                          }`}
                      >
                        Give {f === "once" ? "Once" : "Monthly"}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-5">
                    {/* Amount */}
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black">
                        Donation Amount
                      </p>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {PRESET_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            onClick={() => {
                              setSelectedAmount(amt);
                              setCustomAmount("");
                            }}
                            className={`rounded-xl border-2 cursor-pointer py-3 text-sm font-bold transition ${selectedAmount === amt && !customAmount
                              ? "border-cyan-400 bg-cyan-50 text-cyan-600"
                              : "border-gray-100 text-black hover:border-cyan-200"
                              }`}
                          >
                            Rs. {amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        placeholder="Rs. Enter custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                          if (fieldErrors.amount) setFieldErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        aria-invalid={Boolean(fieldErrors.amount)}
                        className={donationFieldClass(Boolean(fieldErrors.amount))}
                      />
                      {fieldErrors.amount ? <p className="mt-1 text-xs text-red-600">{fieldErrors.amount}</p> : null}
                    </div>

                    {/* Designate */}
                    <div>
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-black">
                        Designate Your Gift
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`rounded-full border-2 px-4 py-2 text-[11px] font-bold transition cursor-pointer ${category === cat
                              ? "border-cyan-400 bg-cyan-400 text-white"
                              : "border-gray-100 text-black hover:border-cyan-200"
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-black">
                        Personal Details
                      </p>
                      <input
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        aria-invalid={Boolean(fieldErrors.name)}
                        className={donationFieldClass(Boolean(fieldErrors.name))}
                      />
                      {fieldErrors.name ? <p className="text-xs text-red-600">{fieldErrors.name}</p> : null}

                      <div>
                        <div className={`flex overflow-hidden rounded-xl border-2 bg-gray-50/50 transition focus-within:bg-white ${fieldErrors.phone ? "border-red-400" : "border-gray-100 focus-within:border-cyan-400"
                          }`}>
                          <span className="flex items-center border-r border-gray-100 bg-gray-100 px-4 text-[10px] font-bold text-black">
                            +977
                          </span>
                          <input
                            placeholder="Phone Number (98XXXXXXXX)"
                            value={form.phone}
                            onChange={(e) => {
                              setForm({ ...form, phone: e.target.value });
                              if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                            }}
                            aria-invalid={Boolean(fieldErrors.phone)}
                            className="flex-1 bg-transparent px-4 py-3 text-sm font-medium outline-none"
                          />
                        </div>
                        {fieldErrors.phone ? <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p> : null}
                      </div>

                      <div>
                        <input
                          placeholder="Email Address"
                          type="email"
                          value={form.email}
                          onChange={(e) => {
                            setForm({ ...form, email: e.target.value });
                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                          }}
                          aria-invalid={Boolean(fieldErrors.email)}
                          className={donationFieldClass(Boolean(fieldErrors.email))}
                        />
                        {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
                      </div>

                      <input
                        placeholder="Residential Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className={donationFieldClass(false)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDonationMessage(null);
                      if (!validateDonationForm()) return;
                      setStep("payment");
                    }}
                    disabled={isSubmitting}
                    className="mt-8 w-full rounded-2xl bg-cyan-400 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-100 hover:bg-cyan-500 active:scale-[0.98] transition disabled:opacity-50"
                  >
                    Proceed to Pay Rs {totalAmount.toLocaleString()}
                  </button>
                </div>
              ) : (
                <PaymentStep
                  data={buildPayload()}
                  isSubmitting={isSubmitting}
                  onBack={() => setStep("form")}
                  onSuccess={(file, payload) => handleSuccess(file, payload)}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </>

  );
}

export default DonateSection
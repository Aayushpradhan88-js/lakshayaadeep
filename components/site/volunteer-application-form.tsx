"use client";

import { FormEvent, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";
import { FastLoading } from "@/components/shared-component/fast-loading";

type VolunteerApplicationFormProps = {
  heading?: string;
  id?: string;
};

function fieldClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-slate-300 focus:border-brand focus:ring-brand-light"
    }`;
}

export function VolunteerApplicationForm({ heading, id = "apply" }: VolunteerApplicationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [socialPrimary, setSocialPrimary] = useState("");
  const [socialAdditional, setSocialAdditional] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Full name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address.";
    if (!phone.trim()) errors.phone = "Phone / WhatsApp number is required.";
    if (!socialPrimary.trim()) errors.socialPrimary = "Add at least one social profile link.";
    if (!message.trim()) errors.message = "Please tell us why you want to volunteer.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      return;
    }

    setFieldErrors({});

    if (!isSupabaseConfigured()) {
      setFormError("Application is not connected. Check Supabase environment variables.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const supabase = getSupabaseClient();
      const bodyParts = [
        message.trim(),
        city.trim() ? `Location: ${city.trim()}` : null,
      ].filter(Boolean);
      const { error } = await supabase.from("contacts").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: "Volunteer application",
        message: bodyParts.join("\n\n") || null,
        social_primary: socialPrimary.trim(),
        social_additional: socialAdditional.trim() || null,
        source: "volunteer",
        status: "pending",
      });
      if (error) throw error;
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setSocialPrimary("");
      setSocialAdditional("");
      setMessage("");
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Something went wrong.";
      setFormError(msg);
      setStatus("error");
    }
  };

  return (
    <section id={id} className="scroll-mt-24 rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {heading ? (
        <h2 className="mb-2 text-2xl font-bold text-slate-900">{heading}</h2>
      ) : (
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Volunteer application</h2>
      )}
      <p className="mb-6 text-black">
        Tell us about yourself. One main social profile is required; you can paste more links below. Our team will reach out using your email or phone.
      </p>

      {status === "success" ? (
        <div className="rounded-xl border border-brand/30 bg-brand-light px-4 py-3 text-brand">
          Thank you — your application was received. We will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">Full name *</label>
              <input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                }}
                aria-invalid={Boolean(fieldErrors.name)}
                className={fieldClass(Boolean(fieldErrors.name))}
              />
              {fieldErrors.name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p> : null}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                className={fieldClass(Boolean(fieldErrors.email))}
              />
              {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">Phone / WhatsApp *</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="+977 ..."
                aria-invalid={Boolean(fieldErrors.phone)}
                className={fieldClass(Boolean(fieldErrors.phone))}
              />
              {fieldErrors.phone ? <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p> : null}
            </div>
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-slate-700">City / area</label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldClass(false)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="socialPrimary" className="mb-1 block text-sm font-medium text-slate-700">Primary social profile (required) *</label>
            <input
              id="socialPrimary"
              value={socialPrimary}
              onChange={(e) => {
                setSocialPrimary(e.target.value);
                if (fieldErrors.socialPrimary) setFieldErrors((prev) => ({ ...prev, socialPrimary: "" }));
              }}
              placeholder="https://instagram.com/... or https://linkedin.com/in/..."
              aria-invalid={Boolean(fieldErrors.socialPrimary)}
              className={fieldClass(Boolean(fieldErrors.socialPrimary))}
            />
            {fieldErrors.socialPrimary ? (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.socialPrimary}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">Paste one link you use most (Instagram, Facebook, LinkedIn, etc.).</p>
            )}
          </div>

          <div>
            <label htmlFor="socialAdditional" className="mb-1 block text-sm font-medium text-slate-700">More social links (optional)</label>
            <textarea
              id="socialAdditional"
              value={socialAdditional}
              onChange={(e) => setSocialAdditional(e.target.value)}
              rows={4}
              placeholder={"Paste additional profile URLs, one per line:\nhttps://...\nhttps://..."}
              className={fieldClass(false)}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">Why do you want to volunteer? *</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: "" }));
              }}
              rows={5}
              aria-invalid={Boolean(fieldErrors.message)}
              className={fieldClass(Boolean(fieldErrors.message))}
            />
            {fieldErrors.message ? <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p> : null}
          </div>

          {formError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p> : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-hover disabled:opacity-60"
          >
            {status === "submitting" ? <FastLoading size="sm" variant="light" /> : "Submit application"}
          </button>
        </form>
      )}
    </section>
  );
}

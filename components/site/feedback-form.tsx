"use client";

import { FormEvent, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";

function fieldClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
  }`;
}

export function FeedbackForm({ heading = "Send your feedback", id = "feedback" }: { heading?: string; id?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    if (!message.trim()) errors.message = "Message is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      return;
    }

    setFieldErrors({});

    if (!isSupabaseConfigured()) {
      setFormError("Feedback is not connected. Check Supabase environment variables.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("contacts").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: "Feedback",
        message: message.trim() || null,
        source: "feedback",
        status: "pending",
      });
      if (error) throw error;

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Something went wrong.";
      setFormError(msg);
      setStatus("error");
    }
  };

  return (
    <section id={id} className="scroll-mt-24 rounded-[18px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">{heading}</h2>
      <p className="mb-6 text-slate-600">Share your thoughts and we’ll respond as soon as possible.</p>

      {status === "success" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
          Thank you — your message was received.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full name *</label>
              <input
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
              <input
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

            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977 ..."
                className={fieldClass(false)}
              />
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
              <input value="Feedback" disabled className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Message *</label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: "" }));
              }}
              rows={6}
              aria-invalid={Boolean(fieldErrors.message)}
              className={fieldClass(Boolean(fieldErrors.message))}
            />
            {fieldErrors.message ? <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p> : null}
          </div>

          {formError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p> : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-900 disabled:opacity-60"
          >
            <FaPaperPlane className="h-4 w-4" />
            {status === "submitting" ? "Sending..." : "Send feedback"}
          </button>
        </form>
      )}
    </section>
  );
}

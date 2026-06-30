"use client";

import { FormEvent, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";

function fieldClass(hasError: boolean) {
  return `w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-brand focus:ring-brand-light"
  }`;
}

type FeedbackFormProps = {
  id?: string;
  showContactInfo?: boolean;
};

export function FeedbackForm({ id = "feedback", showContactInfo = true }: FeedbackFormProps) {
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
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Something went wrong.";
      setFormError(msg);
      setStatus("error");
    }
  };

  return (
    <section id={id} className="scroll-mt-24">
      {showContactInfo ? (
        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-black">
          <a href="mailto:lakhshyadeep@gmail.com" className="hover:text-brand">
            lakhshyadeep@gmail.com
          </a>
          <a href="tel:9819091454" className="hover:text-brand">
            9819091454
          </a>
          <span>Itahari, Sunsari</span>
        </div>
      ) : null}

      {status === "success" ? (
        <div className="rounded-md border border-brand/30 bg-brand-light px-4 py-3 text-sm text-black">
          Thank you — your message was received.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="feedback-name" className="mb-1.5 block text-sm font-medium text-slate-900">
                Name *
              </label>
              <input
                id="feedback-name"
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
              <label htmlFor="feedback-email" className="mb-1.5 block text-sm font-medium text-slate-900">
                Email *
              </label>
              <input
                id="feedback-email"
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
          </div>

          <div>
            <label htmlFor="feedback-phone" className="mb-1.5 block text-sm font-medium text-slate-900">
              Phone <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="feedback-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977 ..."
              className={fieldClass(false)}
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-slate-900">
              Message *
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: "" }));
              }}
              rows={5}
              placeholder="How can we help?"
              aria-invalid={Boolean(fieldErrors.message)}
              className={fieldClass(Boolean(fieldErrors.message))}
            />
            {fieldErrors.message ? <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p> : null}
          </div>

          {formError ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? "Sending..." : "Send message"}
          </button>
        </form>
      )}
    </section>
  );
}

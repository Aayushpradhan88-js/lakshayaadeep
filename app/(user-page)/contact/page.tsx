import { PublicPageShell } from "@/components/site/public-page-shell";
import { FeedbackForm } from "@/components/site/feedback-form";

export default function ContactPage() {
  return (
    <PublicPageShell title="Contact & Feedback" subtitle="Send us a message — our team reads everything.">
      <FeedbackForm />
    </PublicPageShell>
  );
}

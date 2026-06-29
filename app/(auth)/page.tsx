import type { Metadata } from "next";
import Link from "next/link";

// import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignupPage() {
  return (
    <main className="device-responsive-page aux-auth-shell">
      <section className="aux-auth-card">
        <h1>Create Account</h1>

        {/* <SignupForm /> */}

        <p>
          Already have an account? <Link href="/login">Back to login</Link>
        </p>
      </section>
    </main>
  );
}

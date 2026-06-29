import type { LoginFieldErrors, LoginInput } from "@/features/auth/types";

type ParseLoginInputResult =
  | { success: true; data: LoginInput }
  | { success: false; message: string; errors?: LoginFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseLoginInput(payload: unknown): ParseLoginInputResult {
  if (!payload || typeof payload !== "object") {
    return {
      success: false,
      message: "Invalid request payload.",
    };
  }

  const body = payload as {
    email?: unknown;
    password?: unknown;
    remember?: unknown;
  };

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const remember = body.remember === true;

  const errors: LoginFieldErrors = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  return {
    success: true,
    data: {
      email,
      password,
      remember,
    },
  };
}

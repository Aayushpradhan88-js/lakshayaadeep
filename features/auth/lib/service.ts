import type { LoginInput, LoginUser } from "@/features/auth/types";

function toDisplayName(email: string): string {
  const localPart = email.split("@")[0] || "user";
  const normalized = localPart.replace(/[._-]+/g, " ").trim();

  if (!normalized) {
    return "User";
  }

  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function authenticateUser(input: LoginInput): Promise<LoginUser | null> {
  const expectedEmail = process.env.DEMO_LOGIN_EMAIL;
  const expectedPassword = process.env.DEMO_LOGIN_PASSWORD;

  if (expectedEmail && input.email.toLowerCase() !== expectedEmail.toLowerCase()) {
    return null;
  }

  if (expectedPassword && input.password !== expectedPassword) {
    return null;
  }

  return {
    id: "demo-user",
    email: input.email,
    name: toDisplayName(input.email),
  };
}

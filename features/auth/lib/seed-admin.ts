import env from "@/lib/env"

function getConfiguredAdminEmail(): string | null {
  const email = env.ADMIN_EMAIL?.trim()?.toLowerCase()
  console.log("email", email)
  return email || null
}

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const configuredEmail = getConfiguredAdminEmail();
  if (!configuredEmail) {
    return false;
  }

  const isAdminEmail = email.trim().toLowerCase() === configuredEmail
  console.log("isAdminEmail", isAdminEmail)
  return isAdminEmail
}

export {
  getConfiguredAdminEmail,
  isAdminEmail,
}
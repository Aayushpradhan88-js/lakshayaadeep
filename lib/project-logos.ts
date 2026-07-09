import fs from "fs"
import path from "path"

export type ProjectLogo = {
  src: string
  alt: string
}

function toAltName(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\blogo\b/gi, "")
    .trim()
}

export function getProjectLogos(): ProjectLogo[] {
  const dir = path.join(process.cwd(), "public", "project-logos")

  if (!fs.existsSync(dir)) {
    return []
  }

  return fs
    .readdirSync(dir)
    .filter((file) => /\.(png|jpe?g|svg|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
      src: `/project-logos/${file}`,
      alt: toAltName(file) || "Partner logo",
    }))
}

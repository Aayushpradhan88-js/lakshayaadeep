import { DM_Sans, Playfair_Display } from "next/font/google";

export const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const headingFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

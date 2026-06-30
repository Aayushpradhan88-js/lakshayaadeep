import localFont from "next/font/local";

export const satoshiFont = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

/** @deprecated Use satoshiFont — headings and body both use Satoshi */
export const bodyFont = satoshiFont;

/** @deprecated Use satoshiFont — headings and body both use Satoshi */
export const headingFont = satoshiFont;

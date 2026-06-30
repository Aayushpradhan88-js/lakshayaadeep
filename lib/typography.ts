/**
 * Lakshyadeep typography hierarchy — all tokens use Satoshi (applied globally).
 *
 * | Token        | Use case                          | Mobile → Desktop        | Weight   |
 * |--------------|-----------------------------------|-------------------------|----------|
 * | display      | Hero / landing headlines          | 36px → 72px             | 900      |
 * | h1           | Page titles                       | 30px → 48px             | 700      |
 * | h2           | Section headings                  | 24px → 36px             | 700      |
 * | h3           | Card / subsection titles          | 20px → 24px             | 600      |
 * | h4           | Small headings, form group labels | 18px                    | 600      |
 * | bodyLg       | Lead paragraphs, intros           | 18px                    | 400      |
 * | body         | Default paragraph text            | 16px                    | 400      |
 * | bodySm       | Secondary copy, table cells       | 14px                    | 400      |
 * | description  | Section subheadings, supporting text   | 14px                    | 400      |
 * | caption      | Meta, timestamps, footnotes       | 12px                    | 500      |
 * | overline     | Eyebrow / category labels         | 12px, uppercase         | 600      |
 * | label        | Form labels, nav items            | 14px                    | 500      |
 */
export const typography = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  bodyLg: "text-body-lg",
  body: "text-body",
  bodySm: "text-body-sm",
  description: "text-description",
  caption: "text-caption",
  overline: "text-overline",
  label: "text-label",
} as const;

export type TypographyToken = keyof typeof typography;

export function typographyClass(token: TypographyToken): string {
  return typography[token];
}

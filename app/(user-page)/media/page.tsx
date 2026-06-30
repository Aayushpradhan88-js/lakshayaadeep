import { PublicPageShell } from "@/components/site/public-page-shell";

type MediaItem = {
  title: string;
  type: "Video" | "Press" | "Gallery";
  description: string;
  href?: string;
};

const items: MediaItem[] = [
  {
    title: "Annual impact video (placeholder)",
    type: "Video",
    description: "Embed a YouTube or Vimeo link in the page later, or replace this card with a component.",
    href: "https://www.youtube.com",
  },
  {
    title: "Press release: new event launch",
    type: "Press",
    description: "Upload PDFs to /public or link to external coverage. Edit this list in app/media/page.tsx.",
  },
  {
    title: "Photo story from the field",
    type: "Gallery",
    description: "Point visitors to your gallery route or external album when ready.",
  },
];

export default function MediaPage() {
  return (
    <PublicPageShell
      title="Media"
      subtitle="Videos, press, and stories—central place for journalists and supporters."
    >
      {process.env.NODE_ENV === 'development' && (
        <p className="mb-10 leading-relaxed text-black">
          Maintain the <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">items</code> array in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">app/media/page.tsx</code> to add releases,
          video titles, and short descriptions. You can later split into components or fetch from a CMS.
        </p>
      )}

      <ul className="space-y-6">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-[18px] border border-slate-100 bg-slate-50/80 p-6 ring-1 ring-slate-100"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-900">
                {item.type}
              </span>
              <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
            </div>
            <p className="mt-2 text-black">{item.description}</p>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-emerald-800 hover:underline"
              >
                Open link →
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </PublicPageShell>
  );
}

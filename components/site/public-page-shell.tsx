import type { ReactNode } from "react";
import { bodyFont, headingFont } from "@/lib/site-fonts";
import Header from "../homepage/Header/header";
import Footer from "../shared-component/footer/page";

type PublicPageShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function PublicPageShell({ title, subtitle, children }: PublicPageShellProps) {
  return (
    <>
      <Header />
      <div className={`min-h-screen ${bodyFont.className} bg-white text-slate-700`}>

        <main className="pt-16 animate-reveal-up">
          <header className="bg-brand-accent px-4 py-14 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h1 className={`${headingFont.className} text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl`}>
                {title}
              </h1>
              {subtitle ? <p className="mt-3 max-w-2xl text-lg text-white/85">{subtitle}</p> : null}
            </div>
          </header>
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">{children}</div>
        </main>

        <Footer />
      </div>
    </>
  );
}

import type { ReactNode } from "react";

import { typography } from "@/lib/typography";

import Header from "../homepage/Header/header";

import Footer from "../shared-component/footer/page";



type PublicPageShellProps = {

  title: string;

  subtitle?: string;

  variant?: "default" | "minimal";

  showCommunityCta?: boolean;

  children: ReactNode;

};



export function PublicPageShell({

  title,

  subtitle,

  variant = "default",

  showCommunityCta = true,

  children,

}: PublicPageShellProps) {

  const isMinimal = variant === "minimal";



  return (

    <>

      <Header />

      <div className="min-h-screen bg-white text-slate-700">

        <main className="pt-16 animate-reveal-up">

          {isMinimal ? (

            <header className="border-b border-slate-100 px-4 py-10 sm:px-6 lg:px-8">

              <div className="mx-auto max-w-xl">

                <h1 className={`${typography.h2} text-slate-900`}>{title}</h1>

                {subtitle ? (

                  <p className={`mt-2 ${typography.body} text-black`}>{subtitle}</p>

                ) : null}

              </div>

            </header>

          ) : (

            <header className="bg-brand-accent px-4 py-14 text-white sm:px-6 lg:px-8">

              <div className="mx-auto max-w-7xl">

                <h1 className={typography.h1}>{title}</h1>

                {subtitle ? (

                  <p className={`mt-3 max-w-2xl ${typography.bodyLg} text-white/85`}>{subtitle}</p>

                ) : null}

              </div>

            </header>

          )}



          <div

            className={`mx-auto px-4 sm:px-6 lg:px-8 ${

              isMinimal ? "max-w-xl py-10" : "max-w-3xl py-12 lg:py-16"

            }`}

          >

            {children}

          </div>

        </main>



        <Footer showCommunityCta={showCommunityCta} />

      </div>

    </>

  );

}


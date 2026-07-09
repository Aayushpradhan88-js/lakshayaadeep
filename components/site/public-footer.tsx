import Link from "next/link";
import { BrandLogo } from "@/components/shared-component/brand-logo";

export function PublicFooter() {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-4 inline-flex rounded-md bg-white p-2">
              <BrandLogo imageClassName="h-10 max-w-[200px]" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-emerald-100/90">
              A nonprofit dedicated to education, dignity, and sustainable progress for every community we serve.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-200/90">
              Organization
            </h3>
            <ul className="space-y-3 text-sm text-emerald-50/95">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-team" className="hover:underline">
                  Our Team
                </Link>
              </li>
              <li>
                <span className="cursor-default opacity-80">Careers</span>
              </li>
              <li>
                <Link href="/volunteer" className="hover:underline">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  General inquiries
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-emerald-200/90">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-emerald-50/95">
              <li>
                <span className="cursor-default opacity-80">Transparency</span>
              </li>
              <li>
                <span className="cursor-default opacity-80">Impact reports</span>
              </li>
              <li>
                <span className="cursor-default opacity-80">Project reports</span>
              </li>
              <li>
                <Link href="/media" className="hover:underline">
                  Gallery / Media
                </Link>
              </li>
              <li>
                <span className="cursor-default opacity-80">Compliance</span>
              </li>
              <li>
                <Link href="/events" className="hover:underline">
                  Events
                </Link>
              </li>
              <li>
                <a href="mailto:info@lakshyadeep.com?subject=Donation" className="font-semibold hover:underline">
                  Donate Now
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-emerald-800 pt-8 text-sm text-emerald-200/80 sm:flex-row">
          <p>© {new Date().getFullYear()} Lakshyadeep. All rights reserved.</p>
          <span className="cursor-default opacity-80">
            Privacy Policy
          </span>
        </div>
      </div>
    </footer>
  );
}

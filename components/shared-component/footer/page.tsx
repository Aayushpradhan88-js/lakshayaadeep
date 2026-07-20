import React from 'react'
import Link from 'next/link'
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import {
  FOOTER_GET_INVOLVED_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_QUICK_LINKS,
} from '@/components/homepage/Header/nav-config'
import CommunityCtaSection from '@/components/shared-component/community-cta-section'
import { BrandLogo } from '@/components/shared-component/brand-logo'

type FooterProps = {
  showCommunityCta?: boolean
}

const FOOTER_CONTACT = {
  address:
    "Golden Chowk, Ward No. 6, Itahari Sub-Metropolitan City, Sunsari District, Koshi Province, Nepal – 56705",
  email: "lakshyadeep.eca@gmail.com",
  phone: "+977 9767177577",
}

const FOOTER_SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: FaLinkedin, color: "text-[#0a66c2]" },
  { label: "Facebook", href: "https://www.facebook.com", icon: FaFacebook, color: "text-[#3b5998]" },
  { label: "Instagram", href: "https://www.instagram.com", icon: FaInstagram, color: "text-[#e1306c]" },
  { label: "YouTube", href: "https://www.youtube.com", icon: FaYoutube, color: "text-[#ff0000]" },
] as const

const Footer = ({ showCommunityCta = true }: FooterProps) => {
  return (
    <div className="mt-8 bg-white md:mt-10">
      {showCommunityCta ? (
        <>
          <CommunityCtaSection />
          <div className="h-10 bg-white md:h-14" aria-hidden />
        </>
      ) : null}
      <footer className="bg-brand-header text-black">
        <div className="mx-auto max-w-[1200px] px-4 pt-20 pb-10 md:px-8">
          <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <BrandLogo className="mb-4" imageClassName="h-12 max-w-[240px]" />
              <p className="max-w-[250px] text-[15px] leading-relaxed text-black">
                Building a sustainable future through compassion, education, and community empowerment
              </p>
            </div>

            <div>
              <h3 className="mb-6 text-[20px] font-medium text-black">Quick link</h3>
              <ul className="space-y-4">
                {FOOTER_QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] font-medium text-black transition-colors hover:text-black/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-[20px] font-medium text-black">Support us</h3>
              <ul className="space-y-4">
                {FOOTER_GET_INVOLVED_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] font-medium text-black transition-colors hover:text-black/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-[20px] font-medium text-black">Social Media</h3>
              <ul className="space-y-4">
                {FOOTER_SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-[15px] font-medium text-black transition-colors hover:text-black/70"
                      >
                        <Icon size={18} className={social.color} aria-hidden />
                        {social.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div>
              <h3 className="mb-6 text-[20px] font-medium text-black">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="mt-[2px] shrink-0 text-black">
                    <FaMapMarkerAlt size={16} />
                  </span>
                  <span className="text-[15px] font-medium leading-relaxed text-black">
                    {FOOTER_CONTACT.address}
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="shrink-0 text-black">
                    <FaEnvelope size={16} />
                  </span>
                  <a
                    href={`mailto:${FOOTER_CONTACT.email}`}
                    className="text-[15px] font-medium text-black transition-colors hover:text-black/70"
                  >
                    {FOOTER_CONTACT.email}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="shrink-0 text-black">
                    <FaPhoneAlt size={16} />
                  </span>
                  <a
                    href={`tel:${FOOTER_CONTACT.phone.replace(/\s/g, "")}`}
                    className="text-[15px] font-medium text-black transition-colors hover:text-black/70"
                  >
                    {FOOTER_CONTACT.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 bg-black text-white">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:px-8">
            <p className="text-[14px] font-medium text-white/90">
              © 2026 Lakshyadeep. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer

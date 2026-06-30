import React from 'react'
import Link from 'next/link'
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import {
  FOOTER_GET_INVOLVED_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_QUICK_LINKS,
} from '@/components/homepage/Header/nav-config'
import CommunityCtaSection from '@/components/shared-component/community-cta-section'

type FooterProps = {
  showCommunityCta?: boolean
}

const Footer = ({ showCommunityCta = true }: FooterProps) => {
    return (
        <>
        {showCommunityCta ? <CommunityCtaSection /> : null}
        <footer className="mt-12 border-t border-border bg-white pt-20 pb-8">
            <div className="mx-auto max-w-[1200px] px-4 md:px-8">
                <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <Link href="/" className="mb-4 inline-block">
                            <h2 className="text-2xl font-bold tracking-tight">
                                <span className="text-brand">Lakshya</span>
                                <span className="text-brand-accent">deep</span>
                            </h2>
                        </Link>
                        <p className="max-w-[250px] text-[15px] leading-relaxed text-muted-foreground">
                            Building a sustainable future through compassion, education, and community empowerment
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-6 text-[20px] font-medium text-foreground">Quick link</h3>
                        <ul className="space-y-4">
                            {FOOTER_QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-brand-accent">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-[20px] font-medium text-foreground">Get involved</h3>
                        <ul className="space-y-4">
                            {FOOTER_GET_INVOLVED_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-brand-accent">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-[20px] font-medium text-foreground">Contact</h3>
                        <ul className="mb-8 space-y-4">
                            <li className="flex items-start gap-4">
                                <span className="mt-[2px] text-foreground"><FaMapMarkerAlt size={16} /></span>
                                <span className="text-[15px] font-medium text-muted-foreground">Itahari, Sunsari</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="text-foreground"><FaEnvelope size={16} /></span>
                                <a href="mailto:lakhshyadeep@gmail.com" className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-brand-accent">
                                    lakhshyadeep@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-4">
                                <span className="text-foreground"><FaPhoneAlt size={16} /></span>
                                <a href="tel:9819091454" className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-brand-accent">
                                    9819091454
                                </a>
                            </li>
                        </ul>
                        <div className="flex items-center gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#3b5998] transition-opacity hover:opacity-80">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-opacity hover:opacity-80">
                                <FaInstagram size={24} className="text-[#e1306c]" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[#1da1f2] transition-opacity hover:opacity-80">
                                <FaTwitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
                    <p className="text-[14px] font-medium text-muted-foreground">
                        © 2026 Lakshyadeep. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        {FOOTER_LEGAL_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-brand-accent">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
        </>
    )
}

export default Footer

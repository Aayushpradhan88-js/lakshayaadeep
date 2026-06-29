import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel"
import { STAKEHOLDER_TESTIMONIALS } from "@/components/homepage/home-content"

export default function StakeholderTestimonialsSection() {
  return (
    <TestimonialsCarousel
      id="testimonials"
      title="Testimony from"
      titleAccent="Stakeholders"
      subtitle="Community leaders, partners, and volunteers share how Lakshyadeep shows up in their lives."
      items={STAKEHOLDER_TESTIMONIALS}
    />
  )
}

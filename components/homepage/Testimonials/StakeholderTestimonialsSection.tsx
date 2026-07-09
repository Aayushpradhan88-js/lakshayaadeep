import TestimonialsCarousel from "@/components/shared-component/testimonials-carousel"
import { STAKEHOLDER_TESTIMONIALS } from "@/components/homepage/home-content"

export default function StakeholderTestimonialsSection() {
  return (
    <TestimonialsCarousel
      id="testimonials"
      variant="speakers"
      overline="Voices from the field"
      title="Testimony from"
      titleAccent="Stakeholders"
      items={STAKEHOLDER_TESTIMONIALS}
    />
  )
}

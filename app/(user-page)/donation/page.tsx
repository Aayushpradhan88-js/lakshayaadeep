import React from 'react'
import DonateSection from '@/components/homepage/Donation/donation-form'
import Header from '@/components/homepage/Header/header'
import Footer from '@/components/shared-component/footer/page'
import MoneyGoesSection from '@/components/homepage/Donation/money-goes-section'
import CauseEventsSection from '@/components/homepage/Donation/cause-event-section'
import DonorTestimonialsSection from '@/components/homepage/Donation/testimonial'

const DonationPage = () => {
  return (
   <>
    <Header />
    <div className="animate-reveal-up">
      <DonateSection />
      <MoneyGoesSection/>
      <CauseEventsSection/>
      <DonorTestimonialsSection/>
    </div>
      <Footer />
    </>
  )
}

export default DonationPage
"use client"

import React from 'react'
import DonorReportsModal from '@/components/homepage/Donation/reports/report'
import Header from '@/components/homepage/Header/header'
import Footer from '@/components/shared-component/footer/page'

const ReportPage = () => {
  return (
    <>
        <Header/>
        <DonorReportsModal onClose={() => {}}/>
        <Footer/>
    </>
  )
}

export default ReportPage
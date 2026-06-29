import ExploreSection from '@/components/homepage/mission-card/page'
import Header from '@/components/homepage/Header/header'
import Footer from '@/components/shared-component/footer/page'

const MissionPage = () => {
  return (
    <>
      <Header />
      <div className="animate-reveal-up">
        <ExploreSection />
      </div>
      <Footer />
    </>
  )
}

export default MissionPage

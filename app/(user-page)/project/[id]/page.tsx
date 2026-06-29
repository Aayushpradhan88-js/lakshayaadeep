import Header from "@/components/homepage/Header/header";
import PerProject from "@/components/homepage/Project/PerProject";
import Footer from "@/components/shared-component/footer/page";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="animate-reveal-up">
      <Header />
      <PerProject params={params} />
      <Footer />
    </div>
  );
}
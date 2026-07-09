import { getProjectLogos } from "@/lib/project-logos"
import ProjectLogosMarquee from "@/components/shared-component/project-logos-marquee"

export default function ProjectLogosSection() {
  const logos = getProjectLogos()

  return <ProjectLogosMarquee logos={logos} />
}

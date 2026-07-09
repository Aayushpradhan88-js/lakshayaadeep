import { BrandLogo } from "@/components/shared-component/brand-logo"

const Logo = ({ overlay: _overlay }: { overlay?: boolean }) => {
  return <BrandLogo priority imageClassName="h-10 max-w-[200px] md:h-11 md:max-w-[220px]" />
}

export default Logo

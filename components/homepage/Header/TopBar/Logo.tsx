import React from "react"
import Image from "next/image"

const Logo = ({ overlay }: { overlay?: boolean }) => {
  return (
    <div className="flex items-stretch gap-0">
      <div
        className={`flex shrink-0 items-center justify-center ${
          overlay ? "rounded-sm bg-white/95 p-1" : "bg-white p-1"
        }`}
      >
        <Image
          src="/logo.png"
          alt="LAKSHYADEEP Logo"
          width={40}
          height={40}
          className="h-9 w-9 object-contain md:h-10 md:w-10"
        />
      </div>
      <div className="flex min-h-[44px] flex-col justify-stretch">
        <div className="flex flex-1 items-center px-2 py-0.5 md:px-3">
          <span className="text-xs font-bold tracking-wide text-white md:text-sm">
            LAKSHYADEEP
          </span>
        </div>
        <div className="flex flex-1 items-center bg-brand-accent px-2 py-0.5 md:px-3">
          <span className="text-[10px] font-semibold text-white md:text-xs">लक्ष्यदीप</span>
        </div>
      </div>
    </div>
  )
}

export default Logo

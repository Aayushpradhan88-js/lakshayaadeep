import Image from "next/image"
import { BOARD_MESSAGE } from "@/components/homepage/home-content"

export default function BoardMessageSection() {
  return (
    <section id="board-message" className="w-full bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 md:px-14 md:py-20 lg:px-16 lg:py-24">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
            Message from the Board
          </h2>

          <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/95 sm:text-base md:text-[17px] md:leading-8">
            <p>{BOARD_MESSAGE.quote}</p>
          </div>

          <footer className="mt-10 text-center sm:mt-12">
            <p className="text-base font-bold text-white sm:text-lg">{BOARD_MESSAGE.name}</p>
            <p className="mt-1 text-sm font-bold text-white/90 sm:text-base">{BOARD_MESSAGE.role}</p>
          </footer>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[520px]">
          <Image
            src={BOARD_MESSAGE.image}
            alt={BOARD_MESSAGE.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/30 to-transparent lg:via-brand-dark/10"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}

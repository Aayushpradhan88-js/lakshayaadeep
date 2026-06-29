import Image from "next/image"
import { BOARD_MESSAGE } from "@/components/homepage/home-content"

export default function BoardMessageSection() {
  return (
    <section id="board-message" className="w-full bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-brand-dark text-white shadow-xl">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
            <div className="relative h-64 lg:col-span-2 lg:h-full lg:min-h-[320px]">
              <Image
                src={BOARD_MESSAGE.image}
                alt={BOARD_MESSAGE.name}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-dark/40 lg:bg-gradient-to-l lg:from-transparent lg:to-brand-dark" />
            </div>

            <div className="px-6 pb-8 lg:col-span-3 lg:py-10 lg:pr-10 lg:pl-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">Leadership</p>
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                Message from the <span className="font-light text-brand">Board</span>
              </h2>
              <blockquote className="border-l-4 border-brand pl-5 text-base leading-relaxed text-white/90 md:text-lg">
                &ldquo;{BOARD_MESSAGE.quote}&rdquo;
              </blockquote>
              <footer className="mt-6">
                <p className="font-bold text-white">{BOARD_MESSAGE.name}</p>
                <p className="text-sm text-white/70">{BOARD_MESSAGE.role}</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

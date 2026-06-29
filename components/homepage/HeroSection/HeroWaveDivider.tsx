function HeroWaveDivider() {
  return (
    <div className="relative z-20 -mt-px w-full leading-none">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-12 w-full text-brand-accent md:h-16 lg:h-20"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

export default HeroWaveDivider

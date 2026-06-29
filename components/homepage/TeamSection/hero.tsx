import React from 'react'

const TeamSectionHero = () => {
    return (
        <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/ourteam.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/62" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 py-16 max-w-2xl">
                {/* <span className="inline-block border border-cyan-400 text-white text-sm px-5 py-1 rounded-full mb-5">
                    Our Mission
                </span> */}
                <h1 className="font-serif text-5xl font-bold leading-tight mb-4">
                    <span className="text-brand">Together We Build</span>{" "}
                    <span className="text-white">A Better World</span>
                </h1>
                <p className="text-white/80 text-sm mb-10 max-w-lg mx-auto">
                    A passionate, global team united by one mission...
                </p>
                <div className="flex justify-center gap-16">
                    {[["85+", "Team Members"], ["32", "Countries"], ["14", "Departments"]].map(
                        ([num, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-cyan-400 font-serif text-5xl font-bold">{num}</div>
                                <div className="text-white/75 text-xs mt-1">{label}</div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    )
}

export default TeamSectionHero
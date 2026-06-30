
import React from 'react'
import InitiativeCard from './InitiativeCard'

const MissionSection = () => {
    const initiatives = [
        {
            id: 1,
            title: 'Empower Communities',
            description: 'We work alongside local communities to build resilience, develop skill, and create sustainable pathways out of poverty',
            link: '/project',
        },
        {
            id: 2,
            title: 'Educate the Future',
            description: 'Quality education is a right, not a privilege. we fund school, train teacher, and provide scholarship for underserved children',
            link: '/event',
        },
        {
            id: 3,
            title: 'Sustain the Planet',
            description: 'Our environment event restore ecosystem, promote clean energy access, community we serve',
            link: '/project',
        },
    ]

    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text content */}
                    <div>
                        <p className="text-brand font-semibold uppercase tracking-wide mb-3">Our Mission</p>
                        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                            <span className="text-black">WE Exist to</span>{" "} <br />
                            <span className="text-brand font-light">UPlift Humanity</span>
                        </h2>
                        <p className="text-black leading-relaxed mb-4">
                            We believe dignity and opportunity should reach every person, especially those left at the margins.
                            Through transparent event and deep local partnerships, we turn generosity into lasting change.
                        </p>
                        <p className="text-black leading-relaxed">
                            From classrooms to villages, we listen first—then build solutions that communities own, sustain, and grow.
                        </p>
                    </div>

                    {/* Right: Image */}
                    <div className="relative">
                        <img
                            src="/ourteam.jpg"
                            alt="Mission Team"
                            width={600}
                            height={400}
                            className="rounded-2xl w-full h-auto"
                        />
                        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                            <p className="text-sm font-semibold text-black">32+ People Reached</p>
                        </div>
                    </div>
                </div>

                {/* Below: Initiative cards */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {initiatives.map((initiative) => (
                        <InitiativeCard key={initiative.id} {...initiative} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MissionSection
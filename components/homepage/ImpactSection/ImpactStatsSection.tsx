import React from 'react'
import Image from 'next/image'
import StatCard from './StatCard'

const ImpactStatsSection = () => {
    const stats = [
        {
            id: 1,
            number: '5,000',
            label: 'Lives impacted',
            icon: 'users',
        },
        {
            id: 2,
            number: '850+',
            label: 'Communities Served',
            icon: 'globe',
        },
        {
            id: 3,
            number: '20+',
            label: 'Active Volunteers',
            icon: 'heart',
        },
        {
            id: 4,
            number: '98%',
            label: 'Funds to event',
            icon: 'chart',
        },
    ]

    return (
        <div id="impact" className="w-full px-4 md:px-8 py-12">
            <section className="relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0">
                    <Image
                        src="/lakshaydeepimg1.jpeg"
                        alt="Community background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/80" />
                </div>

                <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center text-white md:px-8 md:py-20 lg:py-24">
                    {/* <p className="text-cyan-400 font-semibold uppercase tracking-[0.24em]">
                    Our Mission
                </p> */}
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Numbers That Tell <span className="text-brand font-light">Our Story</span>
                    </h2>
                    <p className="mt-4 max-w-3xl text-sm text-slate-200 sm:text-base">
                        We measure impact through the lives touched, the communities served, and the volunteers who stand with us.
                        Every number reflects a story of hope, dignity, and lasting change.
                    </p>

                    <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <StatCard key={stat.id} number={stat.number} label={stat.label} icon={stat.icon as any} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ImpactStatsSection

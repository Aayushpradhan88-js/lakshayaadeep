import React from 'react'
import Image from 'next/image'

const VolunteerHero = () => {
    return (
        <section className="py-16 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Top Badge */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-cyan-400 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
                        120K+ Volunteers Worldwide
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Image */}
                    <div className="relative">
                        <Image
                            src="/images/volunteer-hero.jpg"
                            alt="Volunteers working together"
                            width={600}
                            height={400}
                            className="rounded-2xl w-full h-auto object-cover shadow-xl"
                            priority
                        />
                    </div>

                    {/* Right Content */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                            Join Our Volunteer Community
                        </h2>
                        <p className="text-black leading-relaxed text-lg mb-8">
                            Make a real difference in your community. Connect with like-minded individuals and contribute to causes that matter. Your time and skills can create lasting change.
                        </p>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VolunteerHero
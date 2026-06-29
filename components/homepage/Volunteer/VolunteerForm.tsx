import React from 'react'
import Image from 'next/image'

const VolunteerForm = () => {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Left: Image with Badge */}
                    <div className="relative">
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
                                alt="Volunteers working"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Overlapping Badge */}
                        <div className="absolute top-8 -right-8 bg-cyan-400 text-white px-8 py-5 rounded-[1.5rem] shadow-md z-10 flex flex-col items-center justify-center">
                            <span className="font-bold text-2xl mb-1">120K+</span>
                            <span className="text-sm font-medium">Volunteers Worldwide</span>
                        </div>
                    </div>

                    {/* Right: Form Content */}
                    <div className="pt-4 lg:pl-4">
                        <p className="text-cyan-400 uppercase tracking-wide text-sm font-semibold mb-3">Join The Movement</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">
                            Become a <span className="text-brand">Volunteer</span>
                        </h2>
                        <p className="text-gray-500 text-base leading-relaxed mb-8">
                            Whether you have a weekend or a lifetime, your skills and passion can change the world. Fill out the forms below and we&apos;ll matcdh you with the perfect opportunity.
                        </p>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-5 py-3.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c9d6] transition-colors border-none text-gray-700 placeholder-gray-400"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-5 py-3.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c9d6] transition-colors border-none text-gray-700 placeholder-gray-400"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-5 py-3.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c9d6] transition-colors border-none text-gray-700 placeholder-gray-400"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Area of interest"
                                    className="w-full px-5 py-3.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c9d6] transition-colors border-none text-gray-700 placeholder-gray-400"
                                    required
                                />
                            </div>

                            <div>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us bit about yourself and why you like to volunteer......"
                                    className="w-full px-5 py-3.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#65c9d6] transition-colors border-none text-gray-700 placeholder-gray-400 resize-none mt-2 mb-6"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-cyan-400 hover:bg-[#5bb8c4] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
                            >
                                Apply to Volunteer
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default VolunteerForm
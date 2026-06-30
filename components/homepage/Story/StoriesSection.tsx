import React from 'react'
import StoryHighlight from './StoryHighlight'
import StoryCard from './StoryCard'

const StoriesSection = () => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                {/* Header Section */}
                <div className="text-center mb-20">
                    {/* <p className="text-cyan-400 font-semibold uppercase tracking-wide mb-3">Real Impact</p> */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-5 flex items-center justify-center gap-3">
                        <span className="text-brand">Stories of Hope</span>
                        <span className="text-[#6b7280]">& Change</span>
                    </h2>
                    <p className="text-black max-w-2xl mx-auto text-base">
                        Behind every Statistic is a human story. These are some of the lives you&apos;ve
                        <br />
                        heloed transform
                    </p>
                </div>

                {/* Main Highlight */}
                <div className="mb-16">
                    <StoryHighlight
                        imageSrc="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1000&auto=format&fit=crop"
                        category="Education"
                        description='"Hopeforward&apos;s  education event change everything for my daughters, three years ago they were helping me sell produce .today, my eldest is											studying engineering at university"'
                        userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                        userName="Anav bista"
                        userLocation="event Beneficiary-Dakar,Senegal"
                    />
                </div>

                {/* Small Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StoryCard
                        imageSrc="https://images.unsplash.com/photo-1542884748-2b87b3306ee1?q=80&w=400&auto=format&fit=crop"
                        name="Anav bista"
                        location="Dakar,Senegal"
                    />
                    <StoryCard
                        imageSrc="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=400&auto=format&fit=crop"
                        name="Anav bista"
                        location="Dakar,Senegal"
                    />
                    <StoryCard
                        imageSrc="https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=400&auto=format&fit=crop"
                        name="Anav bista"
                        location="Dakar,Senegal"
                    />
                    <StoryCard
                        imageSrc="https://images.unsplash.com/photo-1531475510619-354316dbe3b4?q=80&w=400&auto=format&fit=crop"
                        name="Anav bista"
                        location="Dakar,Senegal"
                    />
                </div>
            </div>
        </section>
    )
}

export default StoriesSection
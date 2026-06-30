import React from 'react'
import Image from 'next/image'

interface StoryHighlightProps {
    imageSrc: string
    category: string
    description: string
    userAvatar: string
    userName: string
    userLocation: string
}

const StoryHighlight = ({
    imageSrc,
    category,
    description,
    userAvatar,
    userName,
    userLocation
}: StoryHighlightProps) => {
    const [role, place] = userLocation.split('-');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Large Image */}
            <div className="relative h-[380px] w-full">
                <Image
                    src={imageSrc}
                    alt="Featured story"
                    fill
                    className="rounded-[2rem] object-cover shadow-sm"
                />
            </div>

            {/* Right: Content */}
            <div className="space-y-6 lg:pl-6 max-w-xl">
                {/* Category Badge */}
                <div className="inline-block bg-[#bcecf1] text-[#65c9d6] px-4 py-1.5 rounded-full text-sm font-medium">
                    {category}
                </div>

                {/* Description */}
                <p className="text-black leading-relaxed text-lg font-medium">
                    {description}
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-3 pt-2">
                    <div className="relative w-12 h-12">
                        <Image
                            src={userAvatar}
                            alt={userName}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-[#6b7280]">{userName}</p>
                        <p className="text-black text-sm">
                            <span className="text-[#65c9d6]">{role}</span>-{place}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoryHighlight
import React from 'react'
import Image from 'next/image'

interface StoryCardProps {
    imageSrc: string
    name: string
    location: string
}

const StoryCard = ({ imageSrc, name, location }: StoryCardProps) => {
    return (
        <div className="bg-brand rounded-[1.5rem] overflow-hidden flex flex-col h-[260px]">
            <div className="relative h-[180px] w-full">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="px-5 py-4 flex-1 flex flex-col justify-center">
                <h3 className="text-white font-bold text-base">{name}</h3>
                <p className="text-white/90 text-sm">{location}</p>
            </div>
        </div>
    )
}

export default StoryCard
import React from 'react'
import Link from 'next/link'

interface InitiativeCardProps {
    id: number
    title: string
    description: string
    link: string
}   

const InitiativeCard = ({ title, description, link }: InitiativeCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
            <Link href={link} className="text-cyan-600 hover:text-cyan-400 font-semibold">
                Learn More →
            </Link>
        </div>
    )
}

export default InitiativeCard
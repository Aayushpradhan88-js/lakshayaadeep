"use client";

import Image from "next/image";

interface TeamMember {
    id: string;
    name: string;
    role?: string | null;
    bio?: string | null;
    image_url?: string | null;
    email?: string | null;
}

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

interface Props {
    members: TeamMember[];
}

export default function LeadershipSection({ members }: Props) {
    return (
        <section className="w-full bg-[#f8fafc] px-6 py-20">
            {/* Header */}
            <div className="relative mb-16 text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
                    Leadership
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Guiding the <span className="text-brand font-light ">Mission</span> Forward
                </h2>
                {/* <div className="mt-6 mx-auto w-24 h-1 bg-[#e8885a] rounded-full opacity-20" /> */}
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-black">
                    Our Executive brings decades of experience in global development,
                    operation, and social impact.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="max-w-6xl mx-auto">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {members.map((member) => {
                        // const email = member.email || `${member.name.split(' ')[0].toLowerCase()}`;

                        return (
                            <li
                                key={member.id}
                                className="group relative bg-white rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] flex flex-col items-center"
                            >
                                {/* Photo Container with Mountain/Gradient effect */}
                                <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden mb-8 bg-slate-100 ring-4 ring-slate-50">
                                    {member.image_url ? (
                                        <Image
                                            src={member.image_url}
                                            alt={member.name}
                                            fill
                                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                            <span className="text-4xl font-bold text-slate-400">
                                                {initials(member.name)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Info */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-brand transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-base font-medium text-black">
                                        {member.role || "Team Member"}
                                    </p>
                                    {/* <a 
                                        href={`mailto:${email}`}
                                        className="inline-block text-sm text-black hover:text-brand transition-colors mt-2"
                                    >
                                        {email}
                                    </a> */}
                                </div>

                                {/* Hover Bio Overlay or Tooltip could go here, but keeping it clean like the screenshot */}
                            </li>
                        );
                    })}
                </ul>

                {members.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                        <p className="text-black">Our team is growing. Check back soon for updates.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

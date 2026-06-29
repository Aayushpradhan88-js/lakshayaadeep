import Link from "next/link"

const CARDS = [
    {
        title: "Events",
        description:
            "Health camps, workshops, fundraising galas, and community gatherings — see what's happening and how to get involved.",
        linkHref: "event",
        linkImage: "/mountain.jpg",
    },
    {
        title: "Our Projects",
        description:
            "Schools, clean water systems, health clinics — explore our signature projects transforming communities worldwide.",
        linkHref: "project",
        linkImage: "/forest.jpg",
    },
];

const ExploreSection = () => {
    return (
        <section className="bg-stone-50 px-6 py-16 text-center">
            <h2 className="mb-3 font-serif text-4xl font-semibold text-gray-900">
                Two ways to{" "}
                <em className="font-light text-brand">Explore</em>
            </h2>
            <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-gray-500">
                Learn about our ongoing programs and events, or dive into our
                impact-driven projects.
            </p>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
                {CARDS.map((card) => (
                    <Link
                        key={card.title}
                        href={card.linkHref}
                        className="group relative block h-72 overflow-hidden rounded-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${card.linkImage})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/45 to-black/70" />
                        <div className="absolute inset-0 flex flex-col justify-between p-6 text-left">
                            <div>
                                <h3 className="mb-3 font-serif text-xl font-semibold text-white">
                                    {card.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/75">
                                    {card.description}
                                </p>
                            </div>
                            <span className="mt-4 inline-block self-start rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 group-hover:bg-white/20 group-hover:tracking-wide">
                                {card.linkHref} →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default ExploreSection;

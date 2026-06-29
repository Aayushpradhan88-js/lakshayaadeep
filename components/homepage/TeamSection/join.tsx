"use client";

const openings = [
  { id: 1, title: "Senior HR Manager", location: "Itahari, Sunsari", type: "Full-time" },
  { id: 2, title: "Project Manager", location: "Itahari-10", type: "Intern" },
  { id: 3, title: "Event Management", location: "Itahari-5", type: "Full-time" },
  { id: 4, title: "Project Coordinator", location: "Itahari-10", type: "Part-time" },
];

export default function JoinSection() {
  return (
    <section className="w-full rounded-3xl bg-cyan-200 px-10 py-14 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">

        {/* Left */}
        <div>
          <h2 className="text-4xl font-bold leading-snug text-brand">
            Ready to make
          </h2>
          <h2 className="text-4xl font-bold text-gray-700">
            Your work Count?
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
            We are a Nepal-based youth-led organization empowering youth for
            community development, sustainability, and financial literacy.
          </p>
          {/* <div className="mt-8 flex gap-4">
            <button className="rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600 transition">
              Views All Opening
            </button>
            <button className="rounded-full border-2 border-white bg-white px-6 py-2.5 text-sm font-semibold text-cyan-600 hover:bg-cyan-50 transition">
              Volunteer Instead
            </button>
          </div> */}
        </div>

        {/* Right */}
        <div>
          <p className="mb-4 text-center text-sm font-semibold text-gray-600">
            Current Opening
          </p>
          <div className="flex flex-col gap-3">
            {openings.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-full bg-cyan-400/70 px-6 py-3 cursor-pointer hover:bg-cyan-400 transition"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{job.title}</p>
                  <p className="text-xs text-white/75">{job.location}</p>
                </div>
                <span className="rounded-full border border-white/60 bg-white/20 px-4 py-1 text-xs font-medium text-white">
                  {job.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
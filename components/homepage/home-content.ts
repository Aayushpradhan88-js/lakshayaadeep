export const MISSION_VISION_OBJECTIVES = [
  {
    id: "mission",
    title: "Our Mission",
    body: "To empower and mobilize youth by equipping them with knowledge and skills to drive innovation for a youth-friendly Nation.",
  },
  {
    id: "vision",
    title: "Our Vision",
    body: "Lakshyadeep envisions a youth friendly society.",
  },
  {
    id: "objectives",
    title: "Our Objectives",
    body: "Provide skill-based training, foster intergenerational dialogue, and organize programs for youth entrepreneurship and financial literacy.",
  },
] as const

export const THEMATIC_AREAS = [
  {
    id: 1,
    title: "Environment & Reforestation",
    // description:
      // "Tree plantation drives, clean-up campaigns, and ecosystem restoration across communities in Nepal.",
    image: "/banner/project/project-img.JPG",
    link: "/project",
    priority: true,
  },
  {
    id: 2,
    title: "Education & Youth",
    // description:
      // "Scholarships, school support, and workshops that equip young people with skills for a sustainable future.",
    image: "/banner/Our-team/main.jpg",
    link: "/event",
    priority: true,
  },
  {
    id: 3,
    title: "Community Development",
    // description:
      // "Local partnerships, volunteer mobilization, and grassroots programs that build long-term resilience.",
    image: "/banner/event/event-img.jpg",
    link: "/project",
    priority: true,
  },
  {
    id: 4,
    title: "Health & Wellbeing",
    description: "Health camps and awareness sessions that reach families in underserved areas.",
    image: "/health-welbearing.jpg",
    link: "/event",
    priority: false,
  },
  {
    id: 5,
    title: "Clean Energy Access",
    description: "Promoting renewable solutions and sustainable practices in the communities we serve.",
    image: "/clearn-forest.jpg",
    link: "/project",
    priority: false,
  },
] as const

export const STAKEHOLDER_TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Lakshyadeep's tree plantation program brought our ward together. Volunteers, schools, and local leaders worked side by side — the impact is visible every season.",
    name: "Sunita Sharma",
    role: "Community Leader, Sunsari",
    image: "/banner/About/about-img.jpg",
  },
  {
    id: 2,
    quote:
      "As a partner school, we have seen how their education initiatives create real opportunity. Students receive support, mentorship, and a clearer path forward.",
    name: "Rajesh Karki",
    role: "School Coordinator",
    image: "/banner/project/project-card.jpg",
  },
  {
    id: 3,
    quote:
      "Their transparency and local-first approach made collaboration easy. We trust Lakshyadeep to deliver programs that communities actually need.",
    name: "Ankita Shrestha",
    role: "Volunteer & Donor",
    image: "/banner/event/event-card.jpg",
  },
  {
    id: 4,
    quote:
      "The health camp organized in our village reached families who had never seen a doctor. Lakshyadeep listens first and delivers what people actually need.",
    name: "Bikash Rai",
    role: "Ward Representative, Morang",
    image: "/banner/Our-team/main.jpg",
  },
  {
    id: 5,
    quote:
      "Our students received scholarships and mentorship that changed their outlook on education. Lakshyadeep invests in young people with genuine care.",
    name: "Priya Gurung",
    role: "Principal, Partner School",
    image: "/banner/blog/blog-img.jpg",
  },
  {
    id: 6,
    quote:
      "From tree plantation to community clean-up drives, every initiative brings neighbors together. The impact stays long after the event ends.",
    name: "Deepak Thapa",
    role: "Local Volunteer Coordinator",
    image: "/banner/article/article-img.jpg",
  },
] as const

export const BOARD_MESSAGE = {
  quote:
    "At Lakshyadeep, we believe lasting change grows from communities that are heard, supported, and empowered. Every tree planted, every child educated, and every volunteer engaged moves Nepal closer to a sustainable future we can all be proud of.",
  name: "Board of Directors",
  role: "Lakshyadeep",
  image: "/banner/Our-team/main.jpg",
} as const

export const SUPPORTING_INSTITUTIONS = [
  { id: 1, name: "Local Municipality", icon: "landmark", iconBg: "bg-orange-100", iconColor: "text-brand" },
  { id: 2, name: "Community Schools Network", icon: "graduation-cap", iconBg: "bg-cyan-100", iconColor: "text-cyan-600" },
  { id: 3, name: "Green Nepal Initiative", icon: "leaf", iconBg: "bg-green-100", iconColor: "text-green-600" },
  { id: 4, name: "Youth Volunteer Forum", icon: "users", iconBg: "bg-violet-100", iconColor: "text-violet-600" },
  { id: 5, name: "Regional NGO Alliance", icon: "handshake", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { id: 6, name: "Environmental Partners", icon: "sprout", iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
] as const

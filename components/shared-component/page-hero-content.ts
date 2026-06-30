export type PageHeroStat = {
  value: string;
  label: string;
};

export type PageHeroContent = {
  images: string[];
  overline?: string;
  titlePrefix: string;
  titleAccent: string;
  headlineAccent: string;
  headlineRest: string;
  description: string;
  stats?: PageHeroStat[];
  /** When false, the banner is images + title overlay only (no intro block below). */
  showIntro?: boolean;
};

export const PAGE_HERO_CONTENT = {
  about: {
    images: ["/team3.jpg"],
    titlePrefix: "About ",
    titleAccent: "Lakshyadeep",
    headlineAccent: "We Are Here",
    headlineRest: "to Make a Difference",
    description:
      "Lakshyadeep is a non-profit organization working towards building a better, fairer and sustainable Nepal. We believe every individual deserves the opportunity to live with dignity and hope.",
  },
  projects: {
    images: ["/lakshaydeepimg1.jpeg", "/forest.jpg", "/mountain.jpg"],
    overline: "Get Involved",
    titlePrefix: "Lakshyadeep ",
    titleAccent: "Projects",
    headlineAccent: "Building Hope",
    headlineRest: "Across Communities",
    description:
      "Explore our long-term community projects — from education and health to sustainable development — creating lasting impact across Nepal.",
  },
  projectsEvents: {
    images: ["/lakshaydeepimg1.jpeg", "/team2.jpg", "/forest.jpg"],
    overline: "Get Involved",
    titlePrefix: "Projects ",
    titleAccent: "& Events",
    headlineAccent: "Engage With",
    headlineRest: "Our Mission",
    description:
      "Choose how you want to engage with Lakshyadeep — explore our long-term community projects or join upcoming events across Nepal.",
  },
  ourTeam: {
    images: ["/team2.jpg", "/team3.jpg", "/lakshaydeepimg2.jpeg"],
    titlePrefix: "Our ",
    titleAccent: "Team",
    headlineAccent: "Together We Build",
    headlineRest: "A Better World",
    description:
      "A passionate, global team united by one mission — empowering communities and creating lasting change across Nepal and beyond.",
    stats: [
      { value: "85+", label: "Team Members" },
      { value: "32", label: "Countries" },
      { value: "14", label: "Departments" },
    ],
  },
  blog: {
    images: ["/forest.jpg", "/lakshaydeepimg1.jpeg", "/mountain.jpg"],
    overline: "Our Stories",
    titlePrefix: "Blogs & ",
    titleAccent: "Insights",
    headlineAccent: "Stories That",
    headlineRest: "Inspire Change",
    description:
      "Read firsthand accounts, field updates, and reflections from our team and the communities we serve across Nepal.",
  },
  article: {
    images: ["/mountain.jpg", "/lakshaydeepimg2.jpeg", "/forest.jpg"],
    overline: "Knowledge Hub",
    titlePrefix: "Articles & ",
    titleAccent: "Stories",
    headlineAccent: "Knowledge For",
    headlineRest: "Lasting Impact",
    description:
      "In-depth articles, research, and stories that document our work and share insights on community development and social change.",
  },
} as const satisfies Record<string, PageHeroContent>;

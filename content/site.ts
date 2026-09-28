// Single source of truth for all copy on the site.
// Components read from here — never hardcode copy in a component.

export type NavLink = { label: string; href: string; external?: boolean };

export type Project = {
  id: string; // anchor: rendered as id="project-<id>", targeted by the side nav
  name: string; // small uppercase label
  title: string; // headline, "\n" allowed for a deliberate break
  description: string;
  href: string;
  // "window" = landscape desktop capture, peeks from the top-left.
  // "phone" = portrait mobile capture, centered and bleeding off the bottom.
  image: { src: string; width: number; height: number; frame: "window" | "phone" };
  featured: boolean;
};

export type Logo = { src: string; width: number; height: number };

export type Role = {
  id: string; // anchor: rendered as id="experience-<id>" / "education-<id>"
  dates: string;
  title: string;
  company: string;
  companyUrl?: string;
  logo?: Logo;
  summary: string;
};

export const site = {
  name: "Sanjay Deoram",
  role: "software developer",
  location: "toronto",
  current: { company: "mpac", url: "https://www.mpac.ca" },
  // TODO(sanjay): confirm the email you want public — this one is from the old resume.
  email: "sanjay.deoram@ontariotechu.net",
  resume: "/Resume.pdf",
  // Revealed on hover over the name. Desktop only — never shown on mobile.
  avatar: {
    desktop: { src: "/assets/avatar-desktop.webp", width: 321, height: 264 },
  },

  // Desktop statement: one entry per line (≤ ~30 chars each to fit 352px).
  statementLines: [
    "I turn messy workflows into",
    "software that just works.",
    "Full-stack, practical & fast.",
  ],
  // Mobile statement: `lead` renders in ink-3, `rest` in ink.
  statementMobile: {
    lead: "MPAC",
    prefix: "Currently at ",
    rest: ", I turn messy workflows into software that just works. Full-stack, practical and fast.",
  },

  meta: {
    title: "Sanjay Deoram — Software Developer",
    description:
      "Software developer in Toronto. I turn messy workflows into software that just works.",
  },
} as const;

export const nav: NavLink[] = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#work" },
  { label: "Resume", href: "/Resume.pdf", external: true },
];

export const socials: NavLink[] = [
  { label: "Linkedin", href: "https://www.linkedin.com/in/sanjaydeoram/", external: true },
  { label: "Github", href: "https://github.com/BrandonDeoram", external: true },
  { label: "Youtube", href: "https://www.youtube.com/@sanjay_deoram", external: true },
];

export const projects: Project[] = [
  {
    id: "multipost",
    name: "MultiPost",
    title: "One upload,\nevery platform",
    description:
      "Upload, schedule and track short-form video across YouTube, Instagram and X from a single dashboard.",
    href: "https://github.com/BrandonDeoram/MultiPost",
    image: { src: "/assets/projects/multipost.png", width: 1920, height: 966, frame: "window" },
    featured: true,
  },
  {
    id: "askdocai",
    name: "AskDocAI",
    title: "Talk to your\ndocuments",
    description:
      "Upload a document and ask it questions. Answers come from GPT, grounded in what you gave it.",
    href: "https://github.com/BrandonDeoram/AskDocAI",
    image: { src: "/assets/projects/askdocai.png", width: 1918, height: 982, frame: "window" },
    featured: true,
  },
  {
    id: "geass",
    name: "Geass",
    title: "Anime\nwatch list",
    description: "Track what you're watching, what you've finished and what's next.",
    href: "https://github.com/BrandonDeoram/GeassAnimeWebsite",
    image: { src: "/assets/projects/geass.png", width: 800, height: 594, frame: "window" },
    featured: false,
  },
  {
    id: "goatapp",
    name: "GoatApp",
    title: "Sneaker price\ncomparison",
    description: "A Flutter app that compares resale prices across StockX and GOAT.",
    href: "https://github.com/BrandonDeoram/GoatApp",
    image: { src: "/assets/projects/goatapp-phone.png", width: 552, height: 982, frame: "phone" },
    featured: false,
  },
];

// TODO(sanjay): confirm MPAC title + start date, and Nventure / Codeium end dates
// (LinkedIn blocks automated reads, so these are inferred from the resume + search results).
export const experience: Role[] = [
  {
    id: "mpac",
    dates: "2024 — Present",
    title: "Software Developer",
    company: "MPAC",
    companyUrl: "https://www.mpac.ca",
    logo: { src: "/assets/logos/mpac.svg", width: 580, height: 160 },
    summary:
      "Building software for the Municipal Property Assessment Corporation, the organization that assesses every property in Ontario.",
  },
  {
    id: "nventure",
    dates: "2023 — 2024",
    title: "Software Developer",
    company: "Nventure",
    companyUrl: "https://www.nventure.ca",
    logo: { src: "/assets/logos/nventure.png", width: 100, height: 100 },
    summary:
      "Automated client file processing with Python on AWS Lambda, S3 and SharePoint, saving 180 manual hours a quarter. Built a Next.js scheduler for Instagram stories and podcasts.",
  },
  {
    id: "codeium",
    dates: "2023 — 2024",
    title: "Content Creator, Contract",
    company: "Codeium",
    companyUrl: "https://codeium.com",
    logo: { src: "/assets/logos/codeium.svg", width: 24, height: 24 },
    summary:
      "Made 25+ short-form videos a month on new features and tips, reaching 100K+ monthly views.",
  },
  {
    id: "rubicon",
    dates: "2022",
    title: "Full Stack Developer, Intern",
    company: "Rubicon",
    companyUrl: "https://www.tryrubicon.com",
    logo: { src: "/assets/logos/rubicon.svg", width: 24, height: 24 },
    summary:
      "Built a Freedom of Information request system in React, Flask, Stripe and Twilio that handled 1,000+ requests in its first three months.",
  },
];

export const education: Role[] = [
  {
    id: "ontario-tech",
    dates: "2019 — 2023",
    title: "B.Sc. Computer Science",
    company: "Ontario Tech University",
    companyUrl: "https://ontariotechu.ca",
    logo: { src: "/assets/logos/ontario-tech.png", width: 96, height: 96 },
    summary: "",
  },
];

// Short labels for the side nav (the full titles are too wide for the gutter).
export const sideNav = {
  experienceLabel: "Experience",
  projectsLabel: "Projects",
  educationLabel: "Education",
  // Education child row: short so it fits beside the logo.
  educationShort: "Ontario Tech",
} as const;

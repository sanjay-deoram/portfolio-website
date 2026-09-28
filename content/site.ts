// Single source of truth for all copy on the site.
// Components read from here — never hardcode copy in a component.

export type NavLink = { label: string; href: string; external?: boolean };

export type Project = {
  name: string; // small uppercase label
  title: string; // headline, "\n" allowed for a deliberate break
  description: string;
  href: string;
  // "window" = landscape desktop capture, peeks from the top-left.
  // "phone" = portrait mobile capture, centered and bleeding off the bottom.
  image: { src: string; width: number; height: number; frame: "window" | "phone" };
  featured: boolean;
};

export type Role = {
  dates: string;
  title: string;
  company: string;
  companyUrl?: string;
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
  { label: "Projects", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Resume", href: "/Resume.pdf", external: true },
];

export const socials: NavLink[] = [
  { label: "Linkedin", href: "https://www.linkedin.com/in/sanjaydeoram/", external: true },
  { label: "Github", href: "https://github.com/BrandonDeoram", external: true },
  { label: "Youtube", href: "https://www.youtube.com/@sanjay_deoram", external: true },
];

export const projects: Project[] = [
  {
    name: "MultiPost",
    title: "One upload,\nevery platform",
    description:
      "Upload, schedule and track short-form video across YouTube, Instagram and X from a single dashboard.",
    href: "https://github.com/BrandonDeoram/MultiPost",
    image: { src: "/assets/projects/multipost.png", width: 1920, height: 966, frame: "window" },
    featured: true,
  },
  {
    name: "AskDocAI",
    title: "Talk to your\ndocuments",
    description:
      "Upload a document and ask it questions. Answers come from GPT, grounded in what you gave it.",
    href: "https://github.com/BrandonDeoram/AskDocAI",
    image: { src: "/assets/projects/askdocai.png", width: 1918, height: 982, frame: "window" },
    featured: true,
  },
  {
    name: "Geass",
    title: "Anime\nwatch list",
    description: "Track what you're watching, what you've finished and what's next.",
    href: "https://github.com/BrandonDeoram/GeassAnimeWebsite",
    image: { src: "/assets/projects/geass.png", width: 800, height: 594, frame: "window" },
    featured: false,
  },
  {
    name: "GoatApp",
    title: "Sneaker price\ncomparison",
    description: "A Flutter app that compares resale prices across StockX and GOAT.",
    href: "https://github.com/BrandonDeoram/GoatApp",
    image: { src: "/assets/projects/goatapp-phone.png", width: 552, height: 982, frame: "phone" },
    featured: false,
  },
];

// TODO(sanjay): confirm MPAC title + start date, and NCFDC / Codeium end dates
// (LinkedIn blocks automated reads, so these are inferred from the resume + search results).
export const experience: Role[] = [
  {
    dates: "2024 — Present",
    title: "Software Developer",
    company: "MPAC",
    companyUrl: "https://www.mpac.ca",
    summary:
      "Building software for the Municipal Property Assessment Corporation, the organization that assesses every property in Ontario.",
  },
  {
    dates: "2023 — 2024",
    title: "Software Developer",
    company: "NCFDC",
    companyUrl: "https://www.ncfdc.ca",
    summary:
      "Automated client file processing with Python on AWS Lambda, S3 and SharePoint, saving 180 manual hours a quarter. Built a Next.js scheduler for Instagram stories and podcasts.",
  },
  {
    dates: "2023 — 2024",
    title: "Content Creator, Contract",
    company: "Codeium",
    companyUrl: "https://codeium.com",
    summary:
      "Made 25+ short-form videos a month on new features and tips, reaching 100K+ monthly views.",
  },
  {
    dates: "2022",
    title: "Full Stack Developer, Intern",
    company: "Rubicon",
    summary:
      "Built a Freedom of Information request system in React, Flask, Stripe and Twilio that handled 1,000+ requests in its first three months.",
  },
];

export const education: Role[] = [
  {
    dates: "2019 — 2023",
    title: "B.Sc. Computer Science",
    company: "Ontario Tech University",
    companyUrl: "https://ontariotechu.ca",
    summary: "",
  },
];

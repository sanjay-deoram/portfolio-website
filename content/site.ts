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
  navLabel?: string; // side nav label when `company` is too wide for the gutter
  companyUrl?: string;
  logo?: Logo;
  summary: string;
};

export const site = {
  name: "Sanjay Deoram",
  role: "software developer",
  location: "toronto",
  // TODO(sanjay): confirm the email you want public — this one is from the old resume.
  email: "sanjay.deoram@ontariotechu.net",
  resume: "/SanjayDeoramResume.pdf",
  // Revealed on hover over the name. Desktop only — never shown on mobile.
  avatar: {
    desktop: { src: "/assets/avatar-desktop.webp", width: 321, height: 264 },
  },


  meta: {
    title: "Sanjay Deoram · Engineer & Builder",
    description:
      "Software developer in Toronto. I turn messy workflows into software that just works.",
  },
} as const;

export const nav: NavLink[] = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "/SanjayDeoramResume.pdf", external: true },
];

export const socials: NavLink[] = [
  { label: "Linkedin", href: "https://www.linkedin.com/in/sanjaydeoram/", external: true },
  { label: "Github", href: "https://github.com/sanjay-deoram", external: true },
  { label: "Youtube", href: "https://www.youtube.com/@sanjay_deoram", external: true },
];

// Contribution graph above the footer. Data is read from GitHub's public
// contributions calendar at build time and refreshed daily.
export const github = {
  username: "sanjay-deoram",
  href: "https://github.com/sanjay-deoram",
  heading: "Github",
  // "{n}" is replaced with the total for the last year.
  total: "{n} contributions in the last year",
  totalShort: "{n} contributions", // mobile, where the graph shows half a year
  less: "less",
  more: "more",
  // Hover tooltip on a day cell; the date follows in a lighter tone.
  tooltip: { none: "No contributions", one: "1 contribution", many: "{n} contributions" },
} as const;

export const projects: Project[] = [
  {
    id: "ratemyorg",
    name: "RateMyOrg",
    title: "Honest company\nreviews",
    description:
      "Anonymous company reviews and interview experiences. No sign-in, no takedowns.",
    href: "https://rate-my-org.com",
    image: { src: "/assets/projects/ratemyorg.png", width: 1920, height: 982, frame: "window" },
    featured: true,
  },
  {
    id: "multipost",
    name: "MultiPost",
    title: "One upload,\nevery platform",
    description:
      "Upload, schedule and track short-form video across YouTube, Instagram and X from a single dashboard.",
    href: "https://github.com/sanjay-deoram/MultiPost",
    image: { src: "/assets/projects/multipost.png", width: 1920, height: 966, frame: "window" },
    featured: true,
  },
  {
    id: "askdocai",
    name: "AskDocAI",
    title: "Talk to your\ndocuments",
    description:
      "Upload a document and ask it questions. Answers come from GPT, grounded in what you gave it.",
    href: "https://github.com/sanjay-deoram/AskDocAI",
    image: { src: "/assets/projects/askdocai.png", width: 1918, height: 982, frame: "window" },
    featured: true,
  },
  {
    id: "geass",
    name: "Geass",
    title: "Anime\nwatch list",
    description: "Track what you're watching, what you've finished and what's next.",
    href: "https://github.com/sanjay-deoram/GeassAnimeWebsite",
    image: { src: "/assets/projects/geass.png", width: 800, height: 594, frame: "window" },
    featured: false,
  },
  {
    id: "goatapp",
    name: "GoatApp",
    title: "Sneaker price\ncomparison",
    description: "A Flutter app that compares resale prices across StockX and GOAT.",
    href: "https://github.com/sanjay-deoram/GoatApp",
    image: { src: "/assets/projects/goatapp-phone.png", width: 552, height: 982, frame: "phone" },
    featured: false,
  },
];

// TODO(sanjay): confirm PVX Plus title, MPAC title + start date, and Nventure / Windsurf end dates
// (LinkedIn blocks automated reads, so these are inferred from the resume + search results).
export const experience: Role[] = [
  {
    id: "pvx-plus",
    dates: "2026 — Present",
    title: "Software Developer",
    company: "PVX Plus Technologies",
    navLabel: "PVX Plus",
    companyUrl: "https://home.pvxplus.com",
    logo: { src: "/assets/logos/pvx-plus.png", width: 152, height: 152 },
    summary: "pxplus language (c) + ai agents",
  },
  {
    id: "mpac",
    dates: "2024 — 2026",
    title: "Software Developer",
    company: "MPAC",
    companyUrl: "https://www.mpac.ca",
    logo: { src: "/assets/logos/mpac.svg", width: 580, height: 160 },
    summary: "property assessment for all of ontario, python + react + aws",
  },
  {
    id: "nventure",
    dates: "2023 — 2024",
    title: "Software Developer",
    company: "Nventure",
    companyUrl: "https://www.nventure.ca",
    logo: { src: "/assets/logos/nventure.png", width: 100, height: 100 },
    summary: "automation + ai, python + react + aws",
  },
  {
    id: "windsurf",
    dates: "2023 — 2024",
    title: "Content Creator, Contract",
    company: "Windsurf (Codeium)",
    companyUrl: "https://windsurf.com",
    logo: { src: "/assets/logos/windsurf.svg", width: 24, height: 24 },
    summary: "short-form content, 100k+ views a month",
  },
  {
    id: "rubicon",
    dates: "2022",
    title: "Full Stack Developer, Intern",
    company: "Rubicon",
    companyUrl: "https://www.tryrubicon.com",
    logo: { src: "/assets/logos/rubicon.svg", width: 24, height: 24 },
    summary: "law enforcement services, react + flask + stripe",
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

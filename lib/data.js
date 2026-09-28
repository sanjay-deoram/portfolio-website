import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import bdog from "../public/assets/bdog.jpg";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
];

export const experiencesData = [
  {
    title: "Bachelor of Science",
    location: "Ontario Tech University",
    description:
      "I graduated from Ontario Tech University with a degree in Computer Science.",
    icon: React.createElement(LuGraduationCap),
    date: "2019 - 2023",
  },
  {
    title: "Full Stack Software Developer",
    location: "Rubicon",
    description:
      "I developed a web-based Freedom of Information request system utilizing a stack including HTML/CSS, JavaScript, React.js, Stripe.js, Flask, and Twilio API, facilitating over 1,000 successful requests in the initial three months.",
    icon: React.createElement(FaReact),
    date: "2022 - 2023",
  },
  {
    title: "Software Developer",
    location: "NCFDC",
    description:
      "Programmed automated Python script on AWS Lambda with SharePoint REST API to extract & manipulate client files, slashing manual processing hours by 180 per quarter",
    icon: React.createElement(CgWorkAlt),
    date: "2023 - Present",
  },
];

export const projectsData = [
  {
    title: "CorpComment",
    description:
      "I worked as a full-stack developer on this startup project for 2 years. Users can give public feedback to companies.",
    tags: ["React", "Next.js", "MongoDB", "Tailwind", "Prisma"],
    imageUrl: bdog,
  },
  {
    title: "rmtDev",
    description:
      "Job board for remote developer jobs. I was the front-end developer. It has features like filtering, sorting and pagination.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind", "Redux"],
    imageUrl: bdog,
  },
  {
    title: "Word Analytics",
    description:
      "A public web app for quick analytics on text. It shows word count, character count and social media post limits.",
    tags: ["React", "Next.js", "SQL", "Tailwind", "Framer"],
    imageUrl: bdog,
  },
];

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Apollo",
  "Express",
  "PostgreSQL",
  "Python",
  "Django",
  "Framer Motion",
];

import { Figtree, JetBrains_Mono, Stack_Sans_Headline } from "next/font/google";

// Name, headlines, card titles, pill text.
export const stackSansHeadline = Stack_Sans_Headline({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-stack-sans",
  display: "swap",
});

// Body copy.
export const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-figtree",
  display: "swap",
});

// Uppercase labels, dates, footer links.
export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["200", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${stackSansHeadline.variable} ${figtree.variable} ${jetBrainsMono.variable}`;

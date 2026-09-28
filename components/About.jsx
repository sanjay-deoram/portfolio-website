import React from "react";
import Image from "next/image";
import Link from "next/link";


const About = () => {
  return (
    <div id="about" className="w-full md:h-screen p-2 flex items-center py-16">
      <div className="max-w-[1240px] m-auto md:grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <p className="uppercase text-xl tracking-widest text-[#5651e5]">
            About
          </p>
          <h2 className="py-4">Who I Am</h2>
          <p className="py-2 text-gray-600">
            👋Hi There ! I am a Software Developer with over 1.5 years of
            experience refining my craft and delivering impactful solutions.
            Currently serving as a Software Developer at NCFDC, where I
            developed a Python script deployed on AWS Lambda, revolutionizing
            our data entry process and saving 180 hours of work per quarter.
          </p>
          <p className="py-2 text-gray-600">
            🚀 During my tenure as a Full Stack Developer at Rubicon. I created
            a web-based Freedom of Information request system utilizing
            HTML/CSS, JavaScript, React.js, Stripe.js, Flask & Twilio API, which
            facilitated over 1,000 successful requests by users within the first
            three months.
          </p>
          <p className="py-2 text-gray-600">
            🎥 Outside of my professional endeavors, I&apos;m
            passionate about sharing my knowledge and experiences with the
            broader community. You can find me documenting my coding projects
            and insights on YouTube, where I strive to demystify the world of
            programming and inspire others to pursue their passions in
            technology.
          </p>
          <Link href="/#projects">
            <p className="py-2 text-gray-600 underline cursor-pointer">
              Check out some of my latest projects.
            </p>
          </Link>
        </div>
        <div className="w-full h-auto m-auto shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center p-4 hover:scale-105 ease-in duration-300">
          <Image src="/assets/bdog.jpg" className="rounded-xl" alt="/" width={500} height={500}/>
        </div>
      </div>
    </div>
  );
};

export default About;

import React from "react";
import ProjectItem from "./ProjectItem";

const Projects = () => {
  return (
    <div id="projects" className="w-full">
      <div className="max-w-[1240px] mx-auto px-2 py-16">
        <p className="text-xl tracking-widest uppercase text-[#5651e5]">
          Projects
        </p>
        <h2 className="py-4">What I&apos;ve Built</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ProjectItem
            title="MultiPost"
            backgroundImg="/assets/projects/multipost.png"
            projectUrl="https://github.com/BrandonDeoram/MultiPost"
            tech="Created a video management system with integrated APIs for seamless uploads to YouTube and Instagram, coupled with a real-time analytics dashboard"
          />
          <ProjectItem
            title="AskDocAI"
            backgroundImg="/assets/projects/askdocai.png"
            projectUrl="https://github.com/BrandonDeoram/AskDocAI"
            tech="AskDocAi is a web application that enables users to upload documents and interact with ChatGPT, a powerful AI language model, to gain insights and answers related to the content of those documents"
          />
          <ProjectItem
            title="Geass Anime Website"
            backgroundImg="/assets/projects/geass.png"
            projectUrl="https://github.com/BrandonDeoram/GeassAnimeWebsite"
            tech="Geass is an anime watch list app designed to enhance your anime viewing experience"
          />
          <ProjectItem
            title="GoatApp"
            backgroundImg="/assets/projects/goatapp.png"
            projectUrl="https://github.com/BrandonDeoram/GoatApp"
            tech="A Flutter and Dart e-commerce project allowing price comparison between StockX and GOAT"
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;

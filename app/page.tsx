import { BackdropGrid } from "@/components/backdrop-grid";
import { TopFade } from "@/components/top-fade";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackdropGrid />
      <div className="relative z-10 mx-auto w-[min(100%,390px)] px-6 md:w-frame md:px-0">
        <TopFade />
        <main>
          <Hero />
          <Work />
          <Experience />
        </main>
        <Footer />
      </div>
    </div>
  );
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import DarkCTA from "@/components/sections/DarkCTA";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Features />
      <DarkCTA />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}

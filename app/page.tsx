import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import DarkCTA from "@/components/sections/DarkCTA";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Testimonials from "@/components/sections/Testimonials";
import { TestimonialDTO } from "@/types/testimonials";
import { getTestimonials } from "@/lib/api/marketing";

export default async function Home() {
  let testimonials: TestimonialDTO[] = [];
  try {
    testimonials = await getTestimonials();
  } catch {
  }

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Features />
      <Testimonials testimonials={testimonials} />
      <DarkCTA />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}

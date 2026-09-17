import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import DemoVideo from "@/components/sections/Demovideo";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import DarkCTA from "@/components/sections/DarkCTA";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import type { TestimonialDTO, FormatCardDTO, PricingTierDTO, FaqEntryDTO, SocialLinkDTO, LandingPageData } from "@/types/marketing";
import Clarity from '@microsoft/clarity';
import { getLandingPageData } from "@/lib/api/marketing";

const projectId = "y72uf0awoh"

export default async function Home() {

  let landingData: LandingPageData = {
    testimonials: [],
    formatCards: [],
    pricingTiers: [],
    faqEntries: [],
    socialLinks: [],
  };

  try {
    landingData = await getLandingPageData();
  } catch {
  }

  Clarity.init(projectId);
  
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <DemoVideo youtubeId="lXiVXQSgiZY" />
      <HowItWorks />
      <Features formatCards={landingData.formatCards} />
      <Testimonials testimonials={landingData.testimonials} />
      <DarkCTA />
      <Pricing tiers={landingData.pricingTiers} />
      <FAQ entries={landingData.faqEntries} />
      <Footer socialLinks={landingData.socialLinks} />
    </>
  );
}
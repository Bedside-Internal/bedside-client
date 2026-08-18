import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import DarkCTA from "@/components/sections/DarkCTA";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import { getTestimonials, getFormatCards, getPricingTiers, getFaqEntries } from "@/lib/api/marketing";
import type { TestimonialDTO, FormatCardDTO, PricingTierDTO, FaqEntryDTO } from "@/types/marketing";

export const revalidate = 300;

export default async function Home() {
  let testimonials: TestimonialDTO[] = [];
  let formatCards: FormatCardDTO[] = [];
  let pricingTiers: PricingTierDTO[] = [];
  let faqEntries: FaqEntryDTO[] = [];
  try {
    [testimonials, formatCards, pricingTiers, faqEntries] = await Promise.all([
      getTestimonials(),
      getFormatCards(),
      getPricingTiers(),
      getFaqEntries(),
    ]);
  } catch {
  }

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Features formatCards={formatCards} />
      <Testimonials testimonials={testimonials} />
      <DarkCTA />
      <Pricing tiers={pricingTiers} />
      <FAQ entries={faqEntries} />
      <Footer />
    </>
  );
}
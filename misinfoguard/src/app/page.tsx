import {
  LandingNav, Hero, StatsSection, FeatureCards, HowItWorks, Testimonial, FAQ, CTASection, Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-base-950">
      <LandingNav />
      <Hero />
      <StatsSection />
      <FeatureCards />
      <HowItWorks />
      <Testimonial />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}

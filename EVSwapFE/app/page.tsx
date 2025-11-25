import { Header } from "@/components/shared/header"
import { HeroSection } from "@/components/shared/hero-section"
import { StatsSection } from "@/components/shared/stats-section"
import { FeaturesSection } from "@/components/shared/features-section"
import { StationFinderSection } from "@/components/shared/station-finder-section"
import { PricingSection } from "@/components/shared/pricing-section"
import { TestimonialsSection } from "@/components/shared/testimonials-section"
import { CtaSection } from "@/components/shared/cta-section"
import { Footer } from "@/components/shared/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <StationFinderSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}

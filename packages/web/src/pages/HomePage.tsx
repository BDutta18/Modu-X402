import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { InfrastructureSection } from "../components/landing/InfrastructureSection";
import { MetricsSection } from "../components/landing/MetricsSection";
import { IntegrationsSection } from "../components/landing/IntegrationsSection";
import { SecuritySection } from "../components/landing/SecuritySection";
import { DevelopersSection } from "../components/landing/DevelopersSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { PricingSection } from "../components/landing/PricingSection";
import { CtaSection } from "../components/landing/CtaSection";

export function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden noise-overlay bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <SecuritySection />
      <DevelopersSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
    </div>
  );
}

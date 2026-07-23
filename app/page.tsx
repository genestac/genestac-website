import { HeroMain } from "@/components/home/HeroMain";
import { CellularHeroSection } from "@/components/home/CellularHeroSection";
import { SpinePainSection } from "@/components/home/SpinePainSection";
import { PainServicesSection } from "@/components/home/PainServicesSection";
import { TreatmentProcess } from "@/components/home/TreatmentProcess";
import { TherapiesSection } from "@/components/home/TherapiesSection";
import { TransformationSection } from "@/components/home/TransformationSection";
import { HomeCTASection } from "@/components/home/HomeCTASection";
import { SiteFooter } from "@/components/home/SiteFooter";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Section 1 — Dark Navy Hero with Video Card */}
      <HeroMain />

      {/* Section 2 — Cellular & Genetic Therapies + Services Slider */}
      <CellularHeroSection />

      {/* Section 3 — Spine & Pain Hospital + Specialties + Why Us */}
      <SpinePainSection />

      {/* Section 4 — Pain Treatment Services Grid + Weight Loss Banner */}
      <PainServicesSection />

      {/* Section 5 — 4-Step Treatment Process */}
      <TreatmentProcess />

      {/* Section 6 — Advanced Therapies Accordion + Wellness */}
      <TherapiesSection />

      {/* Section 6.5 — Transformation Stories */}
      <TransformationSection />

      {/* Section 7 — CTA Buttons */}
      <HomeCTASection />
    </main>
  );
}

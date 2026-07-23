import { BeforeAfterSection } from '@/components/weightLoss/BeforeAfterSection'
import { BentoGrid } from '@/components/weightLoss/BentoGrid'
import { CTABanner } from '@/components/weightLoss/CTABanner'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/weightLoss/HeroSection'
import { LongevitySection } from '@/components/weightLoss/LongevitySection'
import { MapSection } from '@/components/weightLoss/MapSection'
import { Marquee } from '@/components/weightLoss/Marquee'
import { PathToOptimization } from '@/components/weightLoss/PathToOptimization'
import { PricingSection } from '@/components/weightLoss/PricingSection'
import { ProtocolSection } from '@/components/weightLoss/ProtocolSection'
import { ShopSection } from '@/components/weightLoss/ShopSection'
import { SupportSection } from '@/components/weightLoss/SupportSection'
import { WeightLossSection } from '@/components/weightLoss/WeightLossSection'
import ScrollToPricing from '@/components/ScrollToPricing'
import React from 'react'

const page = () => {
  return (
    <main className="bg-white overflow-x-hidden">
      <ScrollToPricing />
      {/* Hero — has its own max-w container + pt-28 for sticky header */}
      <HeroSection />

      {/* Full-width marquee ticker */}
      <Marquee />

      {/* Content sections — each manages its own max-w-7xl container */}
      <PathToOptimization />
      <ProtocolSection />
      <WeightLossSection />
      <BeforeAfterSection />
      <BentoGrid />
      <LongevitySection />
      <SupportSection />
      <PricingSection />
      {/* <ShopSection /> */}

      {/* Full-width dark CTA */}
      <CTABanner />

      {/* Map + Footer */}
      <MapSection />
    </main>
  )
}

export default page
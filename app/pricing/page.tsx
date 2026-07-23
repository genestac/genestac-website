"use client"

import { PricingSection } from "@/components/weightLoss/PricingSection";
import { useRouter } from "next/navigation";



export default function PricingPage() {
  const router = useRouter()
  return (
    <>
      <div className="min-h-screen bg-white">
        <PricingSection />
      </div>

      <div className="flex justify-center py-8">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer" onClick={()=>router.push("/weightloss")}>
          Explore
        </button>
      </div>
    </>
  );
}

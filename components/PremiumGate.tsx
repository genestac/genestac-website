"use client"

import React from "react"
import { useSubscription } from "@/context/SubscriptionContext"
import { Lock, Sparkles } from "lucide-react"
import Link from "next/link"

export function PremiumGate({ children, featureName = "This feature" }: { children: React.ReactNode, featureName?: string }) {
  const { isSubscribed, loading } = useSubscription()

  if (loading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center p-6 bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] h-full p-6 text-center bg-slate-50">
        <div className="w-20 h-20 bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-300 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Premium Feature
        </h2>
        <p className="text-slate-500 max-w-md text-sm mb-8 leading-relaxed">
          {featureName} is reserved for members with an active Genestac subscription. Subscribe today to unlock personalized plans, expert guidance, and priority support.
        </p>
        <Link 
          href="/weight-loss#pricing" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          <Sparkles className="w-4 h-4" />
          View Plans
        </Link>
      </div>
    )
  }

  return <>{children}</>
}

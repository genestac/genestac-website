"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type SubscriptionData = {
  id: string
  status: string
  plan_type: string
  plans?: { name: string }
  inventory?: { name: string }
}

type SubscriptionContextType = {
  subscriptions: SubscriptionData[]
  isSubscribed: boolean
  loading: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptions: [],
  isSubscribed: false,
  loading: true,
})

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          setLoading(false)
          return
        }

        // Check if bypassed for testing
        const bypass = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("bypassAuth") === "true"
        if (bypass) {
          // You could optionally mock a subscription here if needed
          setSubscriptions([{
            id: 'mock-sub',
            status: 'active',
            plan_type: 'Weight Loss Plan',
            plans: { name: 'Premium Plan' }
          }])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("subscriptions")
          .select("id, status, plan_type, plans(name), inventory(name)")
          .eq("user_id", session.user.id)
          .eq("status", "active")

        if (error) {
          console.error("Error fetching subscriptions:", error)
        } else if (data) {
          setSubscriptions(data as unknown as SubscriptionData[])
        }
      } catch (error) {
        console.error("Exception fetching subscriptions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()

    // Listen to auth state changes to re-fetch if needed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchSubscriptions()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const isSubscribed = subscriptions.length > 0

  return (
    <SubscriptionContext.Provider value={{ subscriptions, isSubscribed, loading }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  return useContext(SubscriptionContext)
}

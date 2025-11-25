"use client"

import type React from "react"
import { Suspense, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { BookingSidebar } from "@/components/shared/booking-sidebar"

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/signin")
    }
  }, [isLoading, isLoggedIn, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7241CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver area...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#7241CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing driver workspace...</p>
          </div>
        </div>
      }
    >
      <div className="flex h-screen bg-gray-50">
        <BookingSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </Suspense>
  )
}


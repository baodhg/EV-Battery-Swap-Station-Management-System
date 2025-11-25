"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export function CtaSection() {
  const { isLoggedIn } = useAuth()

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#7241CE]" />
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: "url('/modern-electric-vehicle-charging-station-technolog.jpg')",
        }}
      />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center text-white">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/95 max-w-3xl mx-auto text-balance">
            Join thousands of drivers who have switched to instant battery swaps
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isLoggedIn && (
              <Button
                size="lg"
                className="bg-white text-[#7241CE] hover:bg-gray-100 font-semibold text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all"
                asChild
              >
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#7241CE] font-semibold bg-transparent text-lg px-8 py-6 h-auto transition-all"
              asChild
            >
              <a href="#stations">Find Nearest Station</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

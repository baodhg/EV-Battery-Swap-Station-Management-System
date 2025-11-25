"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const { isLoggedIn, user, isLoading } = useAuth()
  const router = useRouter()

  // ✅ Định nghĩa đường dẫn cho từng vai trò
  const ROLE_PATH_MAP: Record<string, string> = {
    admin: "/management",          
    staff: "/staff/queue",
    user: "/booking/find-stations",
  }

  const handleGetStarted = () => {
    console.log("[HeroSection] Get Started clicked - isLoggedIn:", isLoggedIn, "isLoading:", isLoading, "user:", user)

    if (isLoading) {
      console.log("[HeroSection] Still loading auth state, please wait")
      return
    }

    if (isLoggedIn && user) {
      const userRole = String(user.role ?? "user").toLowerCase()
      console.log("[HeroSection] User role (lowercase):", userRole)

      // Lấy đường dẫn phù hợp với role
      const target = ROLE_PATH_MAP[userRole] ?? ROLE_PATH_MAP.user
      console.log(`[HeroSection] Redirecting ${userRole} to:`, target)
      router.push(target)
    } else {
      console.log("[HeroSection] Redirecting to signin page")
      router.push("/signin")
    }
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 text-base md:text-lg">
              <Zap className="w-5 h-5 text-[#A2F200]" />
              <span className="font-semibold text-primary">The Future of EV Energy</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Fast and Reliable EV Battery Swap Stations
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Skip the wait, swap now. Get back on the road in under 3 minutes with our revolutionary battery swap
              technology.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#7241CE] text-white hover:bg-[#5f37b0]"
                onClick={handleGetStarted}
                disabled={isLoading}
              >
                Get Started
              </Button>

              <Button size="lg" className="bg-[#A2F200] text-black hover:bg-[#8fd600]" asChild>
                <a href="#stations">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Station
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                  <span className="w-2 h-2 rounded-full bg-[#A2F200]"></span>3 min
                </div>
                <div className="text-sm text-muted-foreground mt-1">Average swap time</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                  <span className="w-2 h-2 rounded-full bg-[#A2F200]"></span>
                  24/7
                </div>
                <div className="text-sm text-muted-foreground mt-1">Always available</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/modern-electric-vehicle-at-futuristic-purple-and-g.jpg"
                alt="EV Battery Swap Station"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ⚡ Custom icon (thay vì import từ Lucide để nhẹ hơn)
function Zap({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

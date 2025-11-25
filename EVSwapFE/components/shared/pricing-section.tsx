"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function PricingSection() {
  const { isLoggedIn, user, isLoading } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isLoading) {
      console.log("[v0] Still loading auth state, please wait")
      return
    }

    if (isLoggedIn && user) {
      const userRole = user.role?.toLowerCase()
      console.log("[v0] User role (lowercase):", userRole)

      if (userRole === "staff") {
        console.log("[v0] Redirecting staff user to queue page")
        router.push("/staff/queue")
      } else {
        console.log("[v0] Redirecting regular user to find-stations page")
        router.push("/booking/find-stations")
      }
    } else {
      router.push("/signin")
    }
  }

  return (
    <section id="pricing" className="py-24 px-4 scroll-mt-16">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that best fits your driving needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Pay Per Swap</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">600.000</span>
                <span className="text-2xl font-bold">VNĐ</span>
                <span className="text-muted-foreground">/per swap</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for occasional users</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">No monthly commitment</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Pay only when you swap</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Access to all stations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Mobile app included</span>
              </li>
            </ul>

            <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>

          <div className="bg-card border-2 border-primary rounded-2xl p-8 flex flex-col relative shadow-lg scale-110">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Unlimited Monthly</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">3.500.000</span>
                <span className="text-2xl font-bold">VNĐ</span>
                <span className="text-muted-foreground">/per month</span>
              </div>
              <p className="text-sm text-muted-foreground">Best for daily commuters</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Unlimited battery swaps</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Priority reservations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">24/7 customer support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">10% discount on accessories</span>
              </li>
            </ul>

            <Button size="lg" className="w-full bg-primary hover:bg-primary/90" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>

          <div className="bg-card border rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">Custom</span>
                <span className="text-muted-foreground">/pricing</span>
              </div>
              <p className="text-sm text-muted-foreground">For fleets and businesses</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Volume discounts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Dedicated account management</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Custom billing solutions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Priority station access</span>
              </li>
            </ul>

            <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

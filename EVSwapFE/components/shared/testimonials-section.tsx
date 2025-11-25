import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tesla Model 3 Driver",
      content: "EVSwap has revolutionized my daily commute. No more waiting hours to charge!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "BYD Owner",
      content: "As a rideshare driver, time is money. EVSwap keeps me on the road and earning.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Vinfast VF8 Driver",
      content: "Our delivery fleet runs 24/7 thanks to EVSwap's reliable network.",
      rating: 5,
    },
  ]

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground">Join thousands of satisfied EV drivers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border rounded-2xl p-8 flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground mb-6 flex-grow">"{testimonial.content}"</p>

              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

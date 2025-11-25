import { Clock, Battery, MapPin, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Super Fast Swap",
      description: "Complete battery swap in under 3 minutes - faster than refueling",
      color: "text-green-500",
    },
    {
      icon: Battery,
      title: "Always Full Battery",
      description: "Always receive a fully charged battery with our smart management system",
      color: "text-purple-500",
    },
    {
      icon: MapPin,
      title: "Nationwide Network",
      description: "24 stations and expanding across major cities and highways",
      color: "text-purple-500",
    },
    {
      icon: Shield,
      title: "Safe & Reliable",
      description: "All batteries are tested and certified for optimal performance and safety",
      color: "text-green-500",
    },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose EVSwap?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the future of EV energy with our innovative battery swap technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="mb-6">
                  <Icon className={`w-12 h-12 ${feature.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

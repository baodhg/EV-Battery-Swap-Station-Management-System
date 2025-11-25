export function StatsSection() {
  const stats = [
    {
      value: "2.8M",
      label: "Battery Swaps Completed",
    },
    {
      value: "24",
      label: "Stations Nationwide",
    },
    {
      value: "8,547",
      label: "Satisfied Customers",
    },
    {
      value: "99.9%",
      label: "Uptime Reliability",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

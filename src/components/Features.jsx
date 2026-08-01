function Features() {
  const features = [
    {
      icon: "🛣️",
      title: "Smart Routes",
      desc: "Find the fastest and cheapest travel routes.",
    },
    {
      icon: "🏨",
      title: "Hotels",
      desc: "Discover hotels with ratings and prices.",
    },
    {
      icon: "🌤️",
      title: "Weather",
      desc: "Check live weather before your journey.",
    },
    {
      icon: "💰",
      title: "Budget Planner",
      desc: "Estimate your complete trip cost.",
    },
    {
      icon: "📍",
      title: "Tourist Places",
      desc: "Explore famous attractions nearby.",
    },
    {
      icon: "🤖",
      title: "AI Itinerary",
      desc: "Generate a complete AI travel plan.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Why Choose TripDNA AI?
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((item) => (
          <div
            key={item.title}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:scale-105 transition"
          >
            <div className="text-5xl mb-4">{item.icon}</div>

            <h3 className="text-2xl font-semibold text-white mb-2">
              {item.title}
            </h3>

            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
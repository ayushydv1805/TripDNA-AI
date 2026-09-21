function Features() {
  const features = [
    ["🛣️", "Smart Routes", "Find practical routes and compare travel options."],
    ["🏨", "Hotels", "Discover places to stay near your destination."],
    ["🌤️", "Weather", "Check destination weather before you leave."],
    ["💰", "Budget Planner", "Get a simple estimate for major trip costs."],
    ["📍", "Tourist Places", "Explore attractions around your destination."],
    ["🤖", "AI Itinerary", "Generate a day-by-day travel plan with AI."],
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Everything You Need to Plan Better
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(([icon, title, desc]) => (
          <article key={title} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transition hover:-translate-y-1">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;

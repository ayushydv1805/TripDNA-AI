function Testimonials() {
  const reviews = [
    ["Rahul", "TripDNA AI planned my entire Manali trip in minutes!"],
    ["Priya", "Loved the route suggestions and budget estimation."],
    ["Aman", "Much better than searching everything separately."],
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        What Travelers Say
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map(([name, text]) => (
          <article key={name} className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg">
            <p className="text-gray-300 italic">"{text}"</p>
            <h3 className="text-cyan-400 font-semibold mt-6">— {name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;

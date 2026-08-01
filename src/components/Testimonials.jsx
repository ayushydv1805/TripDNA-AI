function Testimonials() {
  const reviews = [
    {
      name: "Rahul",
      text: "TripDNA AI planned my entire Manali trip in minutes!",
    },
    {
      name: "Priya",
      text: "Loved the route suggestions and budget estimation.",
    },
    {
      name: "Aman",
      text: "Much better than searching everything separately.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        What Our Users Say
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg"
          >
            <p className="text-gray-300 italic">"{review.text}"</p>

            <h3 className="text-cyan-400 font-semibold mt-6">
              — {review.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
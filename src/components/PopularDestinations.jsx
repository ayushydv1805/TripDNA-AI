function PopularDestinations() {
  const destinations = [
    {
      name: "Manali",
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
    },
    {
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    },
    {
      name: "Jaipur",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
    },
    {
      name: "Leh Ladakh",
      image:
        "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        Popular Destinations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((place) => (
          <div
            key={place.name}
            className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg hover:scale-105 transition duration-300"
          >
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-56 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">
                {place.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularDestinations;
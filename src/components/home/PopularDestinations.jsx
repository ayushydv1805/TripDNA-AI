import { useNavigate } from "react-router-dom";

function PopularDestinations() {
  const navigate = useNavigate();

  const destinations = [
    { name: "Manali", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800" },
    { name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800" },
    { name: "Jaipur", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800" },
    { name: "Leh Ladakh", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-cyan-400">Explore</p>
          <h2 className="mt-2 text-4xl font-bold text-white">Popular Destinations</h2>
        </div>
        <span className="hidden md:block text-sm text-slate-400">Start with a ready-to-search idea</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((place) => (
          <button
            type="button"
            key={place.name}
            onClick={() => navigate("/search?from=Chandigarh&to=" + encodeURIComponent(place.name))}
            className="group text-left rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg transition hover:-translate-y-1"
          >
            <img src={place.image} alt={place.name} loading="lazy" className="w-full h-56 object-cover transition duration-500 group-hover:scale-105" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">{place.name}</h3>
              <p className="mt-1 text-sm text-slate-400">Plan a trip →</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default PopularDestinations;

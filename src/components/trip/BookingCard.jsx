function BookingCard({ from, to }) {
  const bookingOptions = [
    ["🚆", "Train", from + " → " + to, "Search on IRCTC", "https://www.irctc.co.in/"],
    ["🚌", "Bus", from + " → " + to, "Search on RedBus", "https://www.redbus.in/"],
    ["✈", "Flight", from + " → " + to, "Search Flights", "https://www.makemytrip.com/flights/"],
    ["🏨", "Hotel", to, "Book Hotel", "https://www.booking.com/"],
  ];

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-6">🎫 Book Your Trip</h2>

      <div className="grid md:grid-cols-2 gap-5">
        {bookingOptions.map(([icon, title, route, label, url]) => (
          <article key={title} className="bg-slate-900 p-5 rounded-xl">
            <h3 className="text-2xl mb-3">{icon} {title}</h3>
            <p>{route}</p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 bg-cyan-600 hover:bg-cyan-500 px-5 py-3 rounded-lg font-semibold"
            >
              {label}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BookingCard;

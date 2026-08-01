function BookingCard({ from, to }) {
  const trainUrl = "https://www.irctc.co.in/";
  const busUrl = `https://www.redbus.in/`;
  const flightUrl = `https://www.makemytrip.com/flights/`;
  const hotelUrl = `https://www.booking.com/`;

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-3xl font-bold mb-6">
        🎫 Book Your Trip
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-slate-900 p-5 rounded-xl">
          <h3 className="text-2xl mb-3">🚆 Train</h3>
          <p>{from} → {to}</p>

          <a
            href={trainUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-blue-600 px-5 py-3 rounded-lg"
          >
            Search on IRCTC
          </a>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <h3 className="text-2xl mb-3">🚌 Bus</h3>
          <p>{from} → {to}</p>

          <a
            href={busUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-green-600 px-5 py-3 rounded-lg"
          >
            Search on RedBus
          </a>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <h3 className="text-2xl mb-3">✈ Flight</h3>
          <p>{from} → {to}</p>

          <a
            href={flightUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-purple-600 px-5 py-3 rounded-lg"
          >
            Search Flights
          </a>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl">
          <h3 className="text-2xl mb-3">🏨 Hotel</h3>
          <p>{to}</p>

          <a
            href={hotelUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-orange-600 px-5 py-3 rounded-lg"
          >
            Book Hotel
          </a>
        </div>

      </div>
    </div>
  );
}

export default BookingCard;
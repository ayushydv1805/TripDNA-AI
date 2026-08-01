function TravelModes({ travelModes }) {
  if (!travelModes || travelModes.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-5 my-5">
      <h2 className="text-2xl font-bold mb-4">
        🚗 Travel Options
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {travelModes.map((item, index) => (
          <div
            key={index}
            className="bg-slate-700 rounded-lg p-4"
          >
            <h3 className="text-xl font-bold">
              {item.mode}
            </h3>

            <p>💰 ₹{item.price}</p>

            <p>⏱ {item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TravelModes;
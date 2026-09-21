function TravelModes({ travelModes }) {
  if (!Array.isArray(travelModes) || travelModes.length === 0) return null;

  return (
    <section className="bg-slate-800 rounded-xl p-5 my-5">
      <h2 className="text-2xl font-bold mb-4">🚗 Travel Options</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {travelModes.map((item) => (
          <div key={item.mode} className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-xl font-bold">{item.mode}</h3>
            <p className="mt-2">💰 ₹{Number(item.price).toLocaleString("en-IN")}</p>
            <p className="mt-1">⏱ {item.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TravelModes;

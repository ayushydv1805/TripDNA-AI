function BudgetCard({ budget }) {
  if (!budget) return null;

  const items = [
    ["⛽", "Fuel", budget.fuelCost],
    ["🏨", "Hotel", budget.hotelCost],
    ["🍔", "Food", budget.foodCost],
    ["🎟", "Sightseeing", budget.sightseeing],
  ];

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-5">
      <h2 className="text-2xl font-bold mb-4">💰 Estimated Trip Budget</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(([icon, label, value]) => (
          <div key={label} className="rounded-xl bg-slate-900 p-4">
            <p className="text-slate-400 text-sm">{icon} {label}</p>
            <p className="mt-2 text-xl font-bold">₹{Number(value || 0).toLocaleString("en-IN")}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-600 pt-4">
        <p className="text-sm text-slate-400">Estimated total</p>
        <h3 className="text-3xl font-black text-green-400">
          ₹{Number(budget.total || 0).toLocaleString("en-IN")}
        </h3>
      </div>
    </section>
  );
}

export default BudgetCard;

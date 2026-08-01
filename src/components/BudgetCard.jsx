function BudgetCard({ budget }) {
  if (!budget) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-5">
      <h2 className="text-2xl font-bold mb-4">
        💰 Estimated Trip Budget
      </h2>

      <p>⛽ Fuel: ₹{budget.fuelCost}</p>
      <p>🏨 Hotel: ₹{budget.hotelCost}</p>
      <p>🍔 Food: ₹{budget.foodCost}</p>
      <p>🎟 Sightseeing: ₹{budget.sightseeing}</p>

      <hr className="my-4 border-slate-600" />

      <h3 className="text-3xl font-bold text-green-400">
        Total: ₹{budget.total}
      </h3>
    </div>
  );
}

export default BudgetCard;
export function getTravelModes(distance) {
  return [
    {
      mode: "🚗 Car",
      time: `${Math.round(distance / 60)} hrs`,
      price: Math.round(distance * 6),
    },
    {
      mode: "🚌 Bus",
      time: `${Math.round(distance / 50)} hrs`,
      price: Math.round(distance * 2),
    },
    {
      mode: "🚆 Train",
      time: `${Math.round(distance / 70)} hrs`,
      price: Math.round(distance * 1.5),
    },
    {
      mode: "✈ Flight",
      time: "1.5 hrs",
      price: Math.max(3500, Math.round(distance * 8)),
    },
  ];
}
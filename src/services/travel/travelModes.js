function formatTravelTime(hours) {
  if (hours < 1) {
    return Math.max(30, Math.round(hours * 60)) + " min";
  }

  return hours.toFixed(1) + " hrs";
}

export function getTravelModes(distance) {
  const km = Number(distance);

  if (!Number.isFinite(km) || km <= 0) return [];

  const modes = [
    { mode: "🚗 Car", timeHours: km / 60, price: Math.round(km * 6) },
    { mode: "🚌 Bus", timeHours: km / 50, price: Math.round(km * 2) },
    { mode: "🚆 Train", timeHours: km / 70, price: Math.round(km * 1.5) },
    {
      mode: "✈ Flight",
      timeHours: 1.5,
      price: Math.max(3500, Math.round(km * 8)),
    },
  ];

  return modes.map((mode) => ({
    ...mode,
    time: formatTravelTime(mode.timeHours),
  }));
}

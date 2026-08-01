export function calculateBudget(distance) {
  // Average assumptions
  const mileage = 15;          // km/l
  const petrolPrice = 100;     // ₹/litre
  const hotelCost = 2500 * 2;  // 2 nights
  const foodCost = 1000 * 2;   // 2 days
  const sightseeing = 1500;

  const fuelCost = Math.round((distance / mileage) * petrolPrice);

  return {
    fuelCost,
    hotelCost,
    foodCost,
    sightseeing,
    total:
      fuelCost +
      hotelCost +
      foodCost +
      sightseeing,
  };
}
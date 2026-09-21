const DEFAULTS = {
  mileageKmPerLitre: 15,
  petrolPricePerLitre: 100,
  hotelPerNight: 2500,
  foodPerDay: 1000,
  sightseeing: 1500,
  nights: 2,
  foodDays: 2,
};

export function calculateBudget(distance, overrides = {}) {
  const km = Number(distance);
  if (!Number.isFinite(km) || km < 0) {
    return null;
  }

  const config = { ...DEFAULTS, ...overrides };
  const fuelCost = Math.round(
    (km / config.mileageKmPerLitre) * config.petrolPricePerLitre
  );
  const hotelCost = config.hotelPerNight * config.nights;
  const foodCost = config.foodPerDay * config.foodDays;

  return {
    fuelCost,
    hotelCost,
    foodCost,
    sightseeing: config.sightseeing,
    total: fuelCost + hotelCost + foodCost + config.sightseeing,
  };
}

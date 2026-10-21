const DEFAULTS = {
  mileageKmPerLitre: 15,
  petrolPricePerLitre: 100,
  hotelPerNight: 2500,
  foodPerDay: 1000,
  sightseeing: 1500,
  nights: 2,
  foodDays: 2,
};

function safePositive(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
}

export function calculateBudget(distance, overrides = {}) {
  const km = Number(distance);
  if (!Number.isFinite(km) || km < 0) return null;

  const config = { ...DEFAULTS, ...overrides };
  const mileage = Math.max(1, safePositive(config.mileageKmPerLitre, 15));
  const fuelCost = Math.round((km / mileage) * safePositive(config.petrolPricePerLitre, 100));
  const hotelCost = safePositive(config.hotelPerNight, 2500) * safePositive(config.nights, 2);
  const foodCost = safePositive(config.foodPerDay, 1000) * safePositive(config.foodDays, 2);
  const sightseeing = safePositive(config.sightseeing, 1500);

  return {
    fuelCost,
    hotelCost,
    foodCost,
    sightseeing,
    total: fuelCost + hotelCost + foodCost + sightseeing,
  };
}

export const DETAILED_BUDGET_DEFAULTS = {
  travelers: 2,
  nights: 2,
  foodDays: 3,
  mileageKmPerLitre: 15,
  petrolPricePerLitre: 100,
  hotelPerRoomPerNight: 2500,
  guestsPerRoom: 2,
  foodPerPersonPerDay: 700,
  activitiesPerPerson: 1000,
  otherCosts: 0,
  contingencyPercent: 10,
  roundTrip: true,
};

export function calculateDetailedBudget(distance, input = {}) {
  const settings = { ...DETAILED_BUDGET_DEFAULTS, ...input };
  const km = safePositive(distance);
  const travelers = Math.max(1, Math.round(safePositive(settings.travelers, 1)));
  const nights = Math.round(safePositive(settings.nights));
  const foodDays = Math.round(safePositive(settings.foodDays));
  const mileage = Math.max(1, safePositive(settings.mileageKmPerLitre, 15));
  const pricePerLitre = safePositive(settings.petrolPricePerLitre, 100);
  const hotelPerNight = safePositive(settings.hotelPerRoomPerNight, 2500);
  const guestsPerRoom = Math.max(1, Math.round(safePositive(settings.guestsPerRoom, 2)));
  const foodPerPerson = safePositive(settings.foodPerPersonPerDay, 700);
  const activitiesPerPerson = safePositive(settings.activitiesPerPerson, 1000);
  const otherCosts = safePositive(settings.otherCosts);
  const contingencyPercent = Math.min(30, safePositive(settings.contingencyPercent, 10));
  const fuelDistance = km * (settings.roundTrip ? 2 : 1);
  const fuelCost = Math.round((fuelDistance / mileage) * pricePerLitre);
  const rooms = Math.ceil(travelers / guestsPerRoom);
  const hotelCost = rooms * nights * hotelPerNight;
  const foodCost = travelers * foodDays * foodPerPerson;
  const activitiesCost = travelers * activitiesPerPerson;
  const subtotal = fuelCost + hotelCost + foodCost + activitiesCost + otherCosts;
  const contingency = Math.round(subtotal * contingencyPercent / 100);
  const total = subtotal + contingency;

  return {
    travelers,
    rooms,
    distanceKm: km,
    fuelDistanceKm: fuelDistance,
    fuelCost,
    hotelCost,
    foodCost,
    activitiesCost,
    otherCosts,
    subtotal,
    contingency,
    contingencyPercent,
    total,
    perPerson: Math.ceil(total / travelers),
  };
}

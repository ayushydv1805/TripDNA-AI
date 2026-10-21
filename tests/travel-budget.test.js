import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateBudget,
  calculateDetailedBudget,
  DETAILED_BUDGET_DEFAULTS,
} from "../src/services/travel/budget.js";

test("legacy budget total equals its line items", () => {
  const budget = calculateBudget(150);
  assert.equal(budget.fuelCost, 1000);
  assert.equal(budget.hotelCost, 5000);
  assert.equal(budget.foodCost, 2000);
  assert.equal(budget.sightseeing, 1500);
  assert.equal(budget.total, 9500);
});

test("invalid distance returns null for the legacy calculator", () => {
  assert.equal(calculateBudget(-1), null);
  assert.equal(calculateBudget(Number.NaN), null);
});

test("detailed budget counts return fuel, rooms, food, activities, and contingency", () => {
  const budget = calculateDetailedBudget(100, {
    travelers: 4,
    nights: 2,
    foodDays: 3,
    mileageKmPerLitre: 10,
    petrolPricePerLitre: 100,
    hotelPerRoomPerNight: 3000,
    guestsPerRoom: 2,
    foodPerPersonPerDay: 500,
    activitiesPerPerson: 800,
    otherCosts: 1000,
    contingencyPercent: 10,
    roundTrip: true,
  });

  assert.equal(budget.fuelDistanceKm, 200);
  assert.equal(budget.fuelCost, 2000);
  assert.equal(budget.rooms, 2);
  assert.equal(budget.hotelCost, 12000);
  assert.equal(budget.foodCost, 6000);
  assert.equal(budget.activitiesCost, 3200);
  assert.equal(budget.otherCosts, 1000);
  assert.equal(budget.subtotal, 24200);
  assert.equal(budget.contingency, 2420);
  assert.equal(budget.total, 26620);
  assert.equal(budget.perPerson, 6655);
});

test("budget guards prevent divide-by-zero and cap contingency", () => {
  const result = calculateDetailedBudget(0, {
    travelers: 0,
    mileageKmPerLitre: 0,
    guestsPerRoom: 0,
    contingencyPercent: 500,
  });
  assert.equal(result.travelers, 1);
  assert.equal(result.rooms, 1);
  assert.equal(result.fuelCost, 0);
  assert.equal(result.contingencyPercent, 30);
  assert.ok(Number.isFinite(result.total));
});

test("default detailed settings remain valid", () => {
  const result = calculateDetailedBudget(0, DETAILED_BUDGET_DEFAULTS);
  assert.equal(result.travelers, DETAILED_BUDGET_DEFAULTS.travelers);
  assert.equal(result.rooms, 1);
  assert.ok(result.total >= result.subtotal);
});

import type { DateRange } from "../types"; // We will create this type in the next step
 // We will create this type in the next step

/**
 * Gets the start and end of the current month.
 */
export function getThisMonthRange(): DateRange {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Day 0 of next month is last day of current
  endDate.setHours(23, 59, 59, 999); // Set to end of the day
  return { startDate, endDate };
}

/**
 * Gets the start and end of the previous month.
 */
export function getLastMonthRange(): DateRange {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Day 0 of current month is last day of previous
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

/**
 * Gets a wide "all time" range (e.g., 10 years ago to today).
 */
export function getAllTimeRange(): DateRange {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate.getFullYear() - 10, 0, 1); // 10 years ago
  return { startDate, endDate };
}
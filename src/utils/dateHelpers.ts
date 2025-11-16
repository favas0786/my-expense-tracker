import type { DateRange } from "../types"; 

export function getThisMonthRange(): DateRange {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
  endDate.setHours(23, 59, 59, 999); 
  return { startDate, endDate };
}

export function getLastMonthRange(): DateRange {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0); 
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

export function getAllTimeRange(): DateRange {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate.getFullYear() - 10, 0, 1); 
  return { startDate, endDate };
}
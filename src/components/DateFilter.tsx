import {
  getThisMonthRange,
  getLastMonthRange,
  getAllTimeRange,
} from "../utils/dateHelpers";
import type { DateRange } from "../types";

interface DateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
  currentRange: DateRange;
}

export function DateFilter({ onDateRangeChange, currentRange }: DateFilterProps) {
  const thisMonth = getThisMonthRange();
  const lastMonth = getLastMonthRange();
  const allTime = getAllTimeRange();

  // Helper function to check if two date ranges are equal
  const isRangeEqual = (range1: DateRange, range2: DateRange) => {
    return (
      range1.startDate.getTime() === range2.startDate.getTime() &&
      range1.endDate.getTime() === range2.endDate.getTime()
    );
  };

  return (
    <div className="date-filter-container">
      <button
        className={`date-filter-btn ${isRangeEqual(currentRange, thisMonth) ? "active" : ""}`}
        onClick={() => onDateRangeChange(thisMonth)}
      >
        This Month
      </button>
      <button
        className={`date-filter-btn ${isRangeEqual(currentRange, lastMonth) ? "active" : ""}`}
        onClick={() => onDateRangeChange(lastMonth)}
      >
        Last Month
      </button>
      <button
        className={`date-filter-btn ${isRangeEqual(currentRange, allTime) ? "active" : ""}`}
        onClick={() => onDateRangeChange(allTime)}
      >
        All Time
      </button>
    </div>
  );
}
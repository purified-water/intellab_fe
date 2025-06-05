import { DateRange } from "react-day-picker";

export function getDataBasedOnFilter(rangeType: "Month" | "Custom", _dateRange: DateRange | undefined) {
  // Lọc dữ liệu dựa trên rangeType và _dateRange
  const _data = {
    Month: [
      { month: "Jan", subscriptions: 100, badges: 40, users: 50 },
      { month: "Feb", subscriptions: 130, badges: 55, users: 60 },
      { month: "Mar", subscriptions: 150, badges: 60, users: 70 },
      { month: "Apr", subscriptions: 170, badges: 80, users: 90 },
      { month: "May", subscriptions: 180, badges: 70, users: 100 },
      { month: "Jun", subscriptions: 200, badges: 0, users: 0 } // Default values for missing _data
    ],
    Custom: [
      { date: "Apr 1", subscriptions: 30, badges: 15, users: 20 },
      { date: "Apr 8", subscriptions: 40, badges: 20, users: 25 },
      { date: "Apr 15", subscriptions: 50, badges: 25, users: 30 },
      { date: "Apr 22", subscriptions: 60, badges: 30, users: 35 },
      { date: "Apr 29", subscriptions: 70, badges: 35, users: 40 },
      { date: "May 6", subscriptions: 80, badges: 40, users: 45 }
    ]
  };

  // Return data based on rangeType
  if (rangeType === "Month") {
    return _data.Month; // Dữ liệu theo tháng
  } else if (rangeType === "Custom") {
    return _data.Custom; // Dữ liệu tùy chỉnh
  }

  return []; // Default return if invalid filter
}

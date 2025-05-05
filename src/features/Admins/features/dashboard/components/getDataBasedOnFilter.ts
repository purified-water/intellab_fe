import { DateRange } from "react-day-picker";

export function getDataBasedOnFilter(
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom",
  dateRange: DateRange | undefined
) {
  // Lọc dữ liệu dựa trên rangeType và dateRange
  const data = {
    Monthly: [
      { month: "Jan", subscriptions: 100, badges: 40, users: 50 },
      { month: "Feb", subscriptions: 130, badges: 55, users: 60 },
      { month: "Mar", subscriptions: 150, badges: 60, users: 70 },
      { month: "Apr", subscriptions: 170, badges: 80, users: 90 },
      { month: "May", subscriptions: 180, badges: 70, users: 100 },
      { month: "Jun", subscriptions: 200, badges: 0, users: 0 } // Default values for missing data
    ],
    Weekly: [
      { week: "Week 1", subscriptions: 30, badges: 20, users: 30 },
      { week: "Week 2", subscriptions: 40, badges: 25, users: 40 },
      { week: "Week 3", subscriptions: 50, badges: 30, users: 50 },
      { week: "Week 4", subscriptions: 60, badges: 40, users: 60 }
    ],
    Daily: [
      { day: "Mon", subscriptions: 10, badges: 5, users: 10 },
      { day: "Tue", subscriptions: 15, badges: 6, users: 15 },
      { day: "Wed", subscriptions: 12, badges: 8, users: 20 },
      { day: "Thu", subscriptions: 18, badges: 7, users: 25 },
      { day: "Fri", subscriptions: 20, badges: 10, users: 30 }
    ]
  };

  // Giả sử rangeType là Monthly
  if (rangeType === "Monthly") {
    return data.Monthly; // Dữ liệu theo tháng
  } else if (rangeType === "Weekly") {
    return data.Weekly; // Dữ liệu theo tuần
  } else if (rangeType === "Daily") {
    return data.Daily; // Dữ liệu theo ngày
  }

  return []; // Default return if invalid filter
}

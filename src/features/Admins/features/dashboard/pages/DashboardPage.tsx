import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/shadcn/select";
import { Coins, Users, Activity, ShoppingCart } from "lucide-react";
import { TopStatCard } from "../components/TopStatCard";
import { SubscriptionGrowthLargeChart, SubscriptionGrowthMiniChart } from "../components/SubscriptionsGrowthChart";
import { ZoomableChartCard } from "../components/ZoomChartCard";
import { UserGrowthLargeChart, UserGrowthMiniChart } from "../components/UserGrowthChart";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange"; // Import DatePicker component
import { MonthYearPicker } from "@/components/ui/MonthYearPicker"; // Import MonthYear picker component
import { RevenueLargeBarChart, RevenueMiniBarChart } from "../components/RevenueChart";
import { CompletionRateLargeChart, CompletionRateMiniChart } from "../components/CompletionChart";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { OverviewStatItem } from "@/features/Admins/types/apiType";

export const DashboardPage = () => {
  const [rangeType, setRangeType] = useState<"Month" | "Year" | "Custom">("Month");

  // Set default date range to last 7 days
  const getDefaultDateRange = (): DateRange => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    return {
      from: sevenDaysAgo,
      to: today
    };
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());

  // New state for month/year selection
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [overviewStats, setOverviewStats] = useState<OverviewStatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle month/year change
  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  // Function to handle date range changes with constraints
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (!newDateRange?.from || !newDateRange?.to) {
      setDateRange(newDateRange);
      return;
    }

    // Calculate the difference in days
    const timeDiff = newDateRange.to.getTime() - newDateRange.from.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Constraint: Maximum 30 days (1 month)
    if (daysDiff > 30) {
      // If range is too large, adjust the end date to be 30 days from start date
      const maxEndDate = new Date(newDateRange.from);
      maxEndDate.setDate(maxEndDate.getDate() + 30);

      setDateRange({
        from: newDateRange.from,
        to: maxEndDate
      });
    } else {
      setDateRange(newDateRange);
    }
  };

  useEffect(() => {
    const fetchDashboardOverview = () => {
      adminDashboardAPI.getOverviewStats({
        onStart: async () => {
          setIsLoading(true);
          setError(null);
        },
        onSuccess: async (data) => {
          setOverviewStats(data.result);
        },
        onFail: async (errorMessage) => {
          setError(errorMessage);
        },
        onEnd: async () => {
          setIsLoading(false);
        }
      });
    };

    fetchDashboardOverview();
  }, []);

  // Map API data to topStats with their corresponding icons
  const topStats = [
    {
      title: overviewStats.find((stat) => stat.title === "Total Revenue")?.title || "Total Revenue",
      value: overviewStats.find((stat) => stat.title === "Total Revenue")?.value
        ? new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(
            overviewStats.find((stat) => stat.title === "Total Revenue")?.value || 0
          ) + " VND"
        : "0 VND",
      icon: Coins,
      change: overviewStats.find((stat) => stat.title === "Total Revenue")?.change || "0%",
      changeNote: overviewStats.find((stat) => stat.title === "Total Revenue")?.changeNote || "from last month",
      changeType: overviewStats.find((stat) => stat.title === "Total Revenue")?.changeType || "neutral"
    },
    {
      title: overviewStats.find((stat) => stat.title === "Subscriptions")?.title || "Subscriptions",
      value: overviewStats.find((stat) => stat.title === "Subscriptions")?.value?.toString() || "0",
      icon: Users,
      change: overviewStats.find((stat) => stat.title === "Subscriptions")?.change || "0",
      changeNote:
        overviewStats.find((stat) => stat.title === "Subscriptions")?.changeNote || "new users since last month",
      changeType: overviewStats.find((stat) => stat.title === "Subscriptions")?.changeType || "neutral"
    },
    {
      title: overviewStats.find((stat) => stat.title === "New Users")?.title || "New Users",
      value: overviewStats.find((stat) => stat.title === "New Users")?.value?.toString() || "0",
      icon: Activity,
      change: overviewStats.find((stat) => stat.title === "New Users")?.change || "0",
      changeNote: overviewStats.find((stat) => stat.title === "New Users")?.changeNote || "since last hour",
      changeType: overviewStats.find((stat) => stat.title === "New Users")?.changeType || "neutral"
    },
    {
      title: overviewStats.find((stat) => stat.title === "Courses Purchased")?.title || "Courses Purchased",
      value: overviewStats.find((stat) => stat.title === "Courses Purchased")?.value?.toString() || "0",
      icon: ShoppingCart,
      change: overviewStats.find((stat) => stat.title === "Courses Purchased")?.change || "0",
      changeNote: overviewStats.find((stat) => stat.title === "Courses Purchased")?.changeNote || "since last month",
      changeType: overviewStats.find((stat) => stat.title === "Courses Purchased")?.changeType || "neutral"
    }
  ];

  return (
    <div className="dashboard-container max-w-[1400px] mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-appPrimary">Dashboard</h1>

      {/* Top Stats Section - Fixed to Current Month */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">This Month Overview</h2>
          <span className="px-3 py-1 text-sm rounded-full text-gray3 bg-muted">Fixed to current month</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col gap-2 p-4 border rounded-lg shadow animate-pulse">
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </>
          ) : error ? (
            // Error state
            <div className="col-span-4 p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-red-500">Failed to load dashboard data: {error}</p>
              <button
                className="px-4 py-2 mt-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
                onClick={() => {
                  // Retry fetch on button click
                  adminDashboardAPI.getOverviewStats({
                    onStart: async () => {
                      setIsLoading(true);
                      setError(null);
                    },
                    onSuccess: async (data) => {
                      setOverviewStats(data.result);
                    },
                    onFail: async (errorMessage) => {
                      setError(errorMessage);
                    },
                    onEnd: async () => {
                      setIsLoading(false);
                    }
                  });
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            // Normal data display
            topStats.map((stat, idx) => (
              <TopStatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                changeNote={stat.changeNote}
                changeType={stat.changeType}
              />
            ))
          )}
        </div>
      </div>

      {/* Charts Section with Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Analytics</h2>
          <span className="px-3 py-1 text-sm rounded-full text-gray3 bg-muted">Filtered by selected date range</span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Select time range */}
          <Select value={rangeType} onValueChange={(val: "Month" | "Year" | "Custom") => setRangeType(val)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Month">Month</SelectItem>
              <SelectItem value="Year">Year</SelectItem>
              <SelectItem value="Custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {/* Month/Year Picker for Month and Year filters */}
          {(rangeType === "Month" || rangeType === "Year") && (
            <MonthYearPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthYearChange={handleMonthYearChange}
              rangeType={rangeType}
            />
          )}

          {/* Date Picker for Custom range with constraints */}
          {rangeType === "Custom" && <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />}
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Khối 2: Biểu đồ nhỏ */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
            <ZoomableChartCard
              title="Revenue"
              rangeType={rangeType}
              dateRange={dateRange}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setRangeType={setRangeType}
              setDateRange={setDateRange}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              largeChart={
                <RevenueLargeBarChart
                  rangeType={rangeType}
                  dateRange={dateRange}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              }
            >
              <RevenueMiniBarChart
                rangeType={rangeType}
                dateRange={dateRange}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </ZoomableChartCard>

            <ZoomableChartCard
              title="User Growth"
              largeChart={
                <UserGrowthLargeChart
                  rangeType={rangeType}
                  dateRange={dateRange}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              }
              rangeType={rangeType}
              dateRange={dateRange}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setRangeType={setRangeType}
              setDateRange={setDateRange}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            >
              <UserGrowthMiniChart
                rangeType={rangeType}
                dateRange={dateRange}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </ZoomableChartCard>
          </div>

          {/* Khối 3: Revenue Chart + Completion Rate Chart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ZoomableChartCard
              title="Subscription Growth"
              largeChart={
                <SubscriptionGrowthLargeChart
                  rangeType={rangeType}
                  dateRange={dateRange}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              }
              rangeType={rangeType}
              dateRange={dateRange}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setRangeType={setRangeType}
              setDateRange={setDateRange}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            >
              <SubscriptionGrowthMiniChart
                rangeType={rangeType}
                dateRange={dateRange}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </ZoomableChartCard>
            {/* Completion Rate Chart */}
            <ZoomableChartCard
              title="Course Completion Rate"
              rangeType={rangeType}
              dateRange={dateRange}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setRangeType={setRangeType}
              setDateRange={setDateRange}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              largeChart={
                <CompletionRateLargeChart
                  rangeType={rangeType}
                  dateRange={dateRange}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              }
            >
              <CompletionRateMiniChart
                rangeType={rangeType}
                dateRange={dateRange}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
              />
            </ZoomableChartCard>
          </div>
        </div>
      </div>
    </div>
  );
};

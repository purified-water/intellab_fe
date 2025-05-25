import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/shadcn/select";
import { Coins, Users, Activity, ShoppingCart } from "lucide-react";
import { TopStatCard } from "../components/TopStatCard";
import { SubscriptionGrowthLargeChart, SubscriptionGrowthMiniChart } from "../components/SubscriptionsGrowthChart";
import { ZoomableChartCard } from "../components/ZoomChartCard";
import { UserGrowthLargeChart, UserGrowthMiniChart } from "../components/UserGrowthChart";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange"; // Import DatePicker component
import { RevenueLargeBarChart, RevenueMiniBarChart } from "../components/RevenueChart";
import { CompletionRateLargeChart, CompletionRateMiniChart } from "../components/CompletionChart";
import { TransactionsList } from "../components/TransactionList";
import { TopPurchasesList } from "../components/TopPurchasesList";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { OverviewStatItem } from "@/features/Admins/types/apiType";

export const DashboardPage = () => {
  const [rangeType, setRangeType] = useState<"Daily" | "Weekly" | "Monthly" | "Custom">("Monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const [overviewStats, setOverviewStats] = useState<OverviewStatItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            overviewStats.find((stat) => stat.title === "Total Revenue")?.value || 0
          )
        : "0₫",
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
      changeNote: overviewStats.find((stat) => stat.title === "Subscriptions")?.changeNote || "new users this month",
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

  // const revenueMonthlyData = [
  //   { label: "Jan", value: 500 },
  //   { label: "Feb", value: 700 },
  //   { label: "Mar", value: 600 },
  //   { label: "Apr", value: 800 },
  //   { label: "May", value: 1200 },
  //   { label: "Jun", value: 900 },
  //   { label: "Jul", value: 750 },
  //   { label: "Aug", value: 880 },
  //   { label: "Sep", value: 730 },
  //   { label: "Oct", value: 910 },
  //   { label: "Nov", value: 1100 },
  //   { label: "Dec", value: 1000 }
  // ];

  // const completionRateData = [
  //   { month: "Jan", completionRate: 70 },
  //   { month: "Feb", completionRate: 72 },
  //   { month: "Mar", completionRate: 68 },
  //   { month: "Apr", completionRate: 75 },
  //   { month: "May", completionRate: 80 },
  //   { month: "Jun", completionRate: 78 },
  //   { month: "Jul", completionRate: 82 },
  //   { month: "Aug", completionRate: 79 },
  //   { month: "Sep", completionRate: 85 },
  //   { month: "Oct", completionRate: 83 },
  //   { month: "Nov", completionRate: 86 },
  //   { month: "Dec", completionRate: 88 }
  // ];

  const allTransactions = [
    {
      name: "Olivia Martin",
      email: "olivia@email.com",
      amount: "100,000,000₫",
      date: "2023-04-23",
      status: "Completed",
      type: "Course" as const
    },
    {
      name: "Jack Lee",
      email: "jack@email.com",
      amount: "50,000,000₫",
      date: "2023-04-22",
      status: "Completed",
      type: "Plan" as const
    },
    {
      name: "William Brown",
      email: "william@email.com",
      amount: "75,000,000₫",
      date: "2023-04-20",
      status: "Completed",
      type: "Plan" as const
    },
    {
      name: "Sophia Garcia",
      email: "sophia@email.com",
      amount: "30,000,000₫",
      date: "2023-04-19",
      status: "Failed",
      type: "Course" as const
    },
    {
      name: "Emma Wilson",
      email: "emma@email.com",
      amount: "120,000,000₫",
      date: "2023-04-17",
      status: "Completed",
      type: "Course" as const
    },
    {
      name: "Noah Lee",
      email: "noah@email.com",
      amount: "45,000,000₫",
      date: "2023-04-16",
      status: "Completed",
      type: "Plan" as const
    },
    {
      name: "Ava Tran",
      email: "ava@email.com",
      amount: "90,000,000₫",
      date: "2023-04-15",
      status: "Failed",
      type: "Course" as const
    },
    {
      name: "Mia Jones",
      email: "mia@email.com",
      amount: "80,000,000₫",
      date: "2023-04-13",
      status: "Completed",
      type: "Course" as const
    }
  ];

  const allPurchases = [
    { name: "Olivia Martin", email: "olivia@email.com", amount: "200,000,000₫", plan: "Premium" as const },
    { name: "James Williams", email: "james@email.com", amount: "150,000,000₫", plan: "Premium" as const },
    { name: "Barbara Nguyen", email: "barbara@email.com", amount: "120,000,000₫", plan: "Free" as const },
    { name: "Robert Johnson", email: "robert@email.com", amount: "115,000,000₫", plan: "Premium" as const },
    { name: "Emma Smith", email: "emma@email.com", amount: "110,000,000₫", plan: "Premium" as const },
    { name: "Michael Lee", email: "michael@email.com", amount: "100,000,000₫", plan: "Free" as const },
    { name: "Sophia Kim", email: "sophia@email.com", amount: "95,000,000₫", plan: "Free" as const },
    { name: "David Tran", email: "david@email.com", amount: "90,000,000₫", plan: "Premium" as const },
    { name: "Emily Wang", email: "emily@email.com", amount: "85,000,000₫", plan: "Free" as const },
    { name: "William Chen", email: "william@email.com", amount: "80,000,000₫", plan: "Premium" as const },
    { name: "Ava Garcia", email: "ava@email.com", amount: "75,000,000₫", plan: "Free" as const },
    { name: "Noah Pham", email: "noah@email.com", amount: "70,000,000₫", plan: "Premium" as const }
  ];

  return (
    <div className="dashboard-container max-w-[1400px] mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold tracking-tight text-appPrimary">Dashboard</h1>

      <div className="flex items-center gap-2">
        {/* Select time range */}
        <Select value={rangeType} onValueChange={(val: "Daily" | "Weekly" | "Monthly" | "Custom") => setRangeType(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Monthly" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Picker */}
        {rangeType === "Custom" && <DatePickerWithRange date={dateRange} setDate={setDateRange} />}
      </div>

      {/* Khối 1: Top KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Loading state for KPIs
          <>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-lg border p-4 flex flex-col gap-2 shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </>
        ) : error ? (
          // Error state
          <div className="col-span-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500">Failed to load dashboard data: {error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
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

      {/* Khối 2: Biểu đồ nhỏ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        <ZoomableChartCard
          title="Subscription Growth"
          largeChart={<SubscriptionGrowthLargeChart rangeType={rangeType} dateRange={dateRange} />}
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
        >
          <SubscriptionGrowthMiniChart rangeType={rangeType} dateRange={dateRange} />
        </ZoomableChartCard>

        <ZoomableChartCard
          title="User Growth"
          largeChart={<UserGrowthLargeChart rangeType={rangeType} dateRange={dateRange} />}
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
        >
          <UserGrowthMiniChart rangeType={rangeType} dateRange={dateRange} />
        </ZoomableChartCard>
      </div>

      {/* Khối 3: Revenue Chart + Completion Rate Chart */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <ZoomableChartCard
          title="Revenue"
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
          largeChart={<RevenueLargeBarChart rangeType={rangeType} dateRange={dateRange} />}
        >
          <RevenueMiniBarChart rangeType={rangeType} dateRange={dateRange} />
        </ZoomableChartCard>
        {/* Completion Rate Chart */}
        <ZoomableChartCard
          title="Course Completion Rate"
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
          largeChart={<CompletionRateLargeChart rangeType={rangeType} dateRange={dateRange} />}
        >
          <CompletionRateMiniChart rangeType={rangeType} dateRange={dateRange} />
        </ZoomableChartCard>
      </div>

      {/* Footer: Giao dịch - Subscribers - Problems */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Recent Transactions */}
        <TransactionsList title="Recent Transactions" transactions={allTransactions} limit={3} />
        {/* Top Subscribers */}
        <TopPurchasesList title="Top Purchases" purchases={allPurchases} limit={3} />
      </div>
    </div>
  );
};

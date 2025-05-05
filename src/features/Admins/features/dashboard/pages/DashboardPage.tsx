import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/shadcn/select";
import { SubmissionsPieChart } from "../components/SubmissionsPieChart";
import { Coins, Users, Activity, ShoppingCart, FileCode, CalendarIcon } from "lucide-react";
import { TopStatCard } from "../components/TopStatCard";
import { SubscriptionGrowthLargeChart, SubscriptionGrowthMiniChart } from "../components/SubscriptionsGrowthChart";
import { ZoomableChartCard } from "../components/ZoomChartCard";
import { ActiveUsersTodayLargeChart, ActiveUsersTodayMiniChart } from "../components/ActiveUsersChart";
import { BadgesAwardedLargeChart, BadgesAwardedMiniChart } from "../components/BadgesAwardedChart";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange"; // Import DatePicker component
import { RevenueLargeBarChart, RevenueMiniBarChart } from "../components/RevenueChart";
import { CompletionRateLargeChart, CompletionRateMiniChart } from "../components/CompletionChart";
import { TransactionsList } from "../components/TransactionList";
import { TopPurchasesList } from "../components/TopPurchasesList";

export const DashboardPage = () => {
  const [rangeType, setRangeType] = useState<"Daily" | "Weekly" | "Monthly" | "Custom">("Monthly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const topStats = [
    {
      title: "Total Revenue",
      value: "145,231,290₫",
      icon: Coins,
      change: "+20.1%",
      changeNote: "from last month",
      changeType: "increase" as "increase"
    },
    {
      title: "Subscriptions",
      value: "1,000",
      icon: Users,
      change: "+8",
      changeNote: "new users this month",
      changeType: "increase" as "increase"
    },
    {
      title: "Active Users",
      value: "456",
      icon: Activity,
      change: "+201",
      changeNote: "since last hour",
      changeType: "increase" as "increase"
    },
    {
      title: "Courses Purchased",
      value: "456",
      icon: ShoppingCart,
      change: "-19",
      changeNote: "since last month",
      changeType: "decrease" as "decrease"
    }
  ];

  const revenueMonthlyData = [
    { label: "Jan", value: 500 },
    { label: "Feb", value: 700 },
    { label: "Mar", value: 600 },
    { label: "Apr", value: 800 },
    { label: "May", value: 1200 },
    { label: "Jun", value: 900 },
    { label: "Jul", value: 750 },
    { label: "Aug", value: 880 },
    { label: "Sep", value: 730 },
    { label: "Oct", value: 910 },
    { label: "Nov", value: 1100 },
    { label: "Dec", value: 1000 }
  ];

  const completionRateData = [
    { month: "Jan", completionRate: 70 },
    { month: "Feb", completionRate: 72 },
    { month: "Mar", completionRate: 68 },
    { month: "Apr", completionRate: 75 },
    { month: "May", completionRate: 80 },
    { month: "Jun", completionRate: 78 },
    { month: "Jul", completionRate: 82 },
    { month: "Aug", completionRate: 79 },
    { month: "Sep", completionRate: 85 },
    { month: "Oct", completionRate: 83 },
    { month: "Nov", completionRate: 86 },
    { month: "Dec", completionRate: 88 }
  ];

  const allTransactions = [
    {
      name: "Olivia Martin",
      email: "olivia@email.com",
      amount: "100,000,000₫",
      date: "2023-04-23",
      status: "Completed",
      type: "Course" as "Course"
    },
    {
      name: "Jack Lee",
      email: "jack@email.com",
      amount: "50,000,000₫",
      date: "2023-04-22",
      status: "Completed",
      type: "Plan" as "Plan"
    },
    {
      name: "William Brown",
      email: "william@email.com",
      amount: "75,000,000₫",
      date: "2023-04-20",
      status: "Completed",
      type: "Plan" as "Plan"
    },
    {
      name: "Sophia Garcia",
      email: "sophia@email.com",
      amount: "30,000,000₫",
      date: "2023-04-19",
      status: "Failed",
      type: "Course" as "Course"
    },
    {
      name: "Emma Wilson",
      email: "emma@email.com",
      amount: "120,000,000₫",
      date: "2023-04-17",
      status: "Completed",
      type: "Course" as "Course"
    },
    {
      name: "Noah Lee",
      email: "noah@email.com",
      amount: "45,000,000₫",
      date: "2023-04-16",
      status: "Completed",
      type: "Plan" as "Plan"
    },
    {
      name: "Ava Tran",
      email: "ava@email.com",
      amount: "90,000,000₫",
      date: "2023-04-15",
      status: "Failed",
      type: "Course" as "Course"
    },
    {
      name: "Mia Jones",
      email: "mia@email.com",
      amount: "80,000,000₫",
      date: "2023-04-13",
      status: "Completed",
      type: "Course" as "Course"
    }
  ];

  const allPurchases = [
    { name: "Olivia Martin", email: "olivia@email.com", amount: "200,000,000₫", plan: "Premium" as "Premium" },
    { name: "James Williams", email: "james@email.com", amount: "150,000,000₫", plan: "Premium" as "Premium" },
    { name: "Barbara Nguyen", email: "barbara@email.com", amount: "120,000,000₫", plan: "Free" as "Free" },
    { name: "Robert Johnson", email: "robert@email.com", amount: "115,000,000₫", plan: "Premium" as "Premium" },
    { name: "Emma Smith", email: "emma@email.com", amount: "110,000,000₫", plan: "Premium" as "Premium" },
    { name: "Michael Lee", email: "michael@email.com", amount: "100,000,000₫", plan: "Free" as "Free" },
    { name: "Sophia Kim", email: "sophia@email.com", amount: "95,000,000₫", plan: "Free" as "Free" },
    { name: "David Tran", email: "david@email.com", amount: "90,000,000₫", plan: "Premium" as "Premium" },
    { name: "Emily Wang", email: "emily@email.com", amount: "85,000,000₫", plan: "Free" as "Free" },
    { name: "William Chen", email: "william@email.com", amount: "80,000,000₫", plan: "Premium" as "Premium" },
    { name: "Ava Garcia", email: "ava@email.com", amount: "75,000,000₫", plan: "Free" as "Free" },
    { name: "Noah Pham", email: "noah@email.com", amount: "70,000,000₫", plan: "Premium" as "Premium" }
  ];

  return (
    <div className="w-screen h-screen pr-96 py-6 space-y-8">
      <h1 className="text-4xl text-appPrimary font-bold tracking-tight">Dashboard</h1>

      <div className="flex gap-2 items-center">
        {/* Select time range */}
        <Select value={rangeType} onValueChange={(val) => setRangeType(val as any)}>
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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {topStats.map((stat, idx) => (
          <TopStatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeNote={stat.changeNote}
            changeType={stat.changeType}
          />
        ))}
      </div>

      {/* Khối 2: Biểu đồ nhỏ */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {/* <ZoomableChartCard
          title="Submissions Success Rate"
          children={<SubmissionsPieChart rangeType={rangeType} dateRange={dateRange} />}
          largeChart={<SubmissionsPieChart rangeType={rangeType} dateRange={dateRange} />}
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
        /> */}
        <ZoomableChartCard
          title="Subscription Growth"
          children={<SubscriptionGrowthMiniChart rangeType={rangeType} dateRange={dateRange} />}
          largeChart={<SubscriptionGrowthLargeChart rangeType={rangeType} dateRange={dateRange} />}
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
        />
        <ZoomableChartCard
          title="Active Users Rate"
          children={<ActiveUsersTodayMiniChart rangeType={rangeType} dateRange={dateRange} />}
          largeChart={<ActiveUsersTodayLargeChart rangeType={rangeType} dateRange={dateRange} />}
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
        />

        {/* <ZoomableChartCard
          title="Badges Awarded"
          children={<BadgesAwardedMiniChart rangeType={rangeType} dateRange={dateRange} />}
          largeChart={<BadgesAwardedLargeChart rangeType={rangeType} dateRange={dateRange} />}
          rangeType={rangeType}
          dateRange={dateRange}
          setRangeType={setRangeType}
          setDateRange={setDateRange}
        /> */}
      </div>

      {/* Khối 3: Revenue Chart + Completion Rate Chart */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {/* Recent Transactions */}
        <TransactionsList title="Recent Transactions" transactions={allTransactions} limit={3} />
        {/* Top Subscribers */}
        <TopPurchasesList title="Top Purchases" purchases={allPurchases} limit={3} />
      </div>
    </div>
  );
};

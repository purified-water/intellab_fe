import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DateRange } from "react-day-picker";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { CourseCompletionRateItem } from "@/features/Admins/types/apiType";

function getFallbackData(rangeType: "Month" | "Year" | "Custom" | "Daily" | "Weekly") {
  // Fallback data in case API fails
  const fallbackData = {
    Daily: [
      { label: "Mon", completionRate: 75 },
      { label: "Tue", completionRate: 78 },
      { label: "Wed", completionRate: 80 },
      { label: "Thu", completionRate: 77 },
      { label: "Fri", completionRate: 82 },
      { label: "Sat", completionRate: 85 },
      { label: "Sun", completionRate: 79 }
    ],
    Weekly: [
      { label: "Week 1", completionRate: 72 },
      { label: "Week 2", completionRate: 75 },
      { label: "Week 3", completionRate: 78 },
      { label: "Week 4", completionRate: 80 }
    ],
    Month: [
      { label: "1", completionRate: 65 },
      { label: "2", completionRate: 68 },
      { label: "3", completionRate: 70 },
      { label: "4", completionRate: 72 },
      { label: "5", completionRate: 75 },
      { label: "6", completionRate: 73 },
      { label: "7", completionRate: 78 },
      { label: "8", completionRate: 76 },
      { label: "9", completionRate: 80 },
      { label: "10", completionRate: 77 },
      { label: "11", completionRate: 82 },
      { label: "12", completionRate: 79 },
      { label: "13", completionRate: 85 },
      { label: "14", completionRate: 83 },
      { label: "15", completionRate: 87 },
      { label: "16", completionRate: 84 },
      { label: "17", completionRate: 89 },
      { label: "18", completionRate: 86 },
      { label: "19", completionRate: 91 },
      { label: "20", completionRate: 88 },
      { label: "21", completionRate: 92 },
      { label: "22", completionRate: 90 },
      { label: "23", completionRate: 94 },
      { label: "24", completionRate: 91 },
      { label: "25", completionRate: 95 },
      { label: "26", completionRate: 93 },
      { label: "27", completionRate: 96 },
      { label: "28", completionRate: 94 },
      { label: "29", completionRate: 97 },
      { label: "30", completionRate: 95 }
    ],
    Year: [
      { label: "Jan", completionRate: 72 },
      { label: "Feb", completionRate: 74 },
      { label: "Mar", completionRate: 70 },
      { label: "Apr", completionRate: 77 },
      { label: "May", completionRate: 82 },
      { label: "Jun", completionRate: 80 },
      { label: "Jul", completionRate: 84 },
      { label: "Aug", completionRate: 81 },
      { label: "Sep", completionRate: 87 },
      { label: "Oct", completionRate: 85 },
      { label: "Nov", completionRate: 88 },
      { label: "Dec", completionRate: 90 }
    ],
    Custom: [
      // This would typically be filtered based on the dateRange
      { label: "Period 1", completionRate: 76 },
      { label: "Period 2", completionRate: 79 },
      { label: "Period 3", completionRate: 84 }
    ]
  };

  // Return data based on the rangeType
  return fallbackData[rangeType] || fallbackData["Month"];
}

interface Props {
  rangeType: "Month" | "Year" | "Custom" | "Daily" | "Weekly";
  dateRange: DateRange | undefined;
  selectedMonth?: number;
  selectedYear?: number;
}

interface ChartData {
  label: string;
  completionRate: number;
}

export function CompletionRateMiniChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletionRate = useCallback(() => {
    console.log("Fetching completion rate data", rangeType, dateRange);
    // Convert rangeType to the expected API parameter
    let period: "daily" | "weekly" | "monthly" | "custom" = "monthly";
    const query: { period?: "daily" | "weekly" | "monthly" | "custom"; start_date?: string; end_date?: string } = {};

    if (rangeType === "Month" && selectedMonth !== undefined && selectedYear !== undefined) {
      period = "daily";
      // Calculate date range for the selected month to get daily data
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);
      query.start_date = startDate.toISOString().split("T")[0];
      query.end_date = endDate.toISOString().split("T")[0];
    } else if (rangeType === "Year" && selectedYear !== undefined) {
      period = "custom";
      // Calculate date range for the selected year
      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31);
      query.start_date = startDate.toISOString().split("T")[0];
      query.end_date = endDate.toISOString().split("T")[0];
    } else if (rangeType === "Custom" && dateRange?.from && dateRange?.to) {
      period = "custom";
      // Format dates as YYYY-MM-DD for API
      query.start_date = dateRange.from.toISOString().split("T")[0];
      query.end_date = dateRange.to.toISOString().split("T")[0];
    } else {
      period = "monthly";
    }

    query.period = period;

    adminDashboardAPI.getCourseCompletionRate({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format
        const formattedData = responseData.result.map((item: CourseCompletionRateItem) => ({
          label: item.label,
          completionRate: item.value
        }));
        setData(formattedData);
      },
      onFail: async (errorMessage) => {
        setError(errorMessage);
        // Fall back to sample data if API fails
        setData(getFallbackData(rangeType));
      },
      onEnd: async () => {
        setIsLoading(false);
      }
    });
  }, [rangeType, dateRange, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchCompletionRate();
  }, [fetchCompletionRate]);

  // Render loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-[250px] rounded"></div>
      </div>
    );
  }
  // Show error message with retry button if API call failed
  if (error && data.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center">
        <div className="text-red-500 mb-2">Failed to load completion rate data</div>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={fetchCompletionRate}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={10} />
          <YAxis domain={[0, 100]} fontSize={10} width={25} tickMargin={4} />
          <Tooltip formatter={(value) => `${value}%`} />
          <defs>
            <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5a3295" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#5a3295" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="completionRate" stroke="#5a3295" fill="url(#completionGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionRateLargeChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseCompletionRate = useCallback(() => {
    console.log("Fetching CourseCompletionRate data", rangeType, dateRange);
    // Convert rangeType to the expected API parameter
    let period: "daily" | "weekly" | "monthly" | "custom" = "monthly";
    const query: { period?: "daily" | "weekly" | "monthly" | "custom"; start_date?: string; end_date?: string } = {};

    if (rangeType === "Daily") {
      period = "daily";
    } else if (rangeType === "Weekly") {
      period = "weekly";
    } else if (rangeType === "Month" && selectedMonth !== undefined && selectedYear !== undefined) {
      period = "daily";
      // Calculate date range for the selected month to get daily data
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0);
      query.start_date = startDate.toISOString().split("T")[0];
      query.end_date = endDate.toISOString().split("T")[0];
    } else if (rangeType === "Year" && selectedYear !== undefined) {
      period = "custom";
      // Calculate date range for the selected year
      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31);
      query.start_date = startDate.toISOString().split("T")[0];
      query.end_date = endDate.toISOString().split("T")[0];
    } else if (rangeType === "Custom" && dateRange?.from && dateRange?.to) {
      period = "custom";
      // Format dates as YYYY-MM-DD for API
      query.start_date = dateRange.from.toISOString().split("T")[0];
      query.end_date = dateRange.to.toISOString().split("T")[0];
    } else {
      period = "monthly";
    }

    query.period = period;

    adminDashboardAPI.getCourseCompletionRate({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format
        const formattedData = responseData.result.map((item: CourseCompletionRateItem) => ({
          label: item.label,
          completionRate: item.value
        }));
        setData(formattedData);
      },
      onFail: async (errorMessage) => {
        setError(errorMessage);
        // Fall back to sample data if API fails
        setData(getFallbackData(rangeType));
      },
      onEnd: async () => {
        setIsLoading(false);
      }
    });
  }, [rangeType, dateRange, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchCourseCompletionRate();
  }, [fetchCourseCompletionRate]);

  // Render loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-[350px] rounded"></div>
      </div>
    );
  }

  // Show error message with retry button if API call failed
  if (error && data.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center">
        <div className="text-red-500 mb-2">Failed to load revenue data</div>
        <button
          className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          onClick={fetchCourseCompletionRate}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis domain={[0, 100]} />
        <Tooltip formatter={(value) => `${value}%`} />
        <defs>
          <linearGradient id="completionGradientLarge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5a3295" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#5a3295" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="completionRate"
          stroke="#5a3295"
          fill="url(#completionGradientLarge)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

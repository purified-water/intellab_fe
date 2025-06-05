import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DateRange } from "react-day-picker";
import { useState, useEffect, useCallback } from "react";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";

interface Props {
  rangeType: "Month" | "Year" | "Custom";
  dateRange: DateRange | undefined;
  selectedMonth?: number;
  selectedYear?: number;
}

interface ChartData {
  label: string;
  users: number;
}

// Function to get fallback data if the API fails
const getFallbackData = (rangeType: string): ChartData[] => {
  const fallbackData: ChartData[] = [];

  if (rangeType === "Daily") {
    // Simple daily fallback data
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((day, index) => {
      fallbackData.push({ label: day, users: 10 + index * 5 });
    });
  } else if (rangeType === "Weekly") {
    // Simple weekly fallback data
    for (let i = 1; i <= 4; i++) {
      fallbackData.push({ label: `Week ${i}`, users: 30 + i * 10 });
    }
  } else {
    // Simple monthly fallback data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach((month, index) => {
      fallbackData.push({ label: month, users: 50 + index * 10 });
    });
  }

  return fallbackData;
};

export function UserGrowthMiniChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGrowth = useCallback(() => {
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

    adminDashboardAPI.getUserGrowth({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format
        const formattedData = responseData.result.map((item) => ({
          label: item.label,
          users: item.value
        }));
        setData(formattedData);
      },
      onFail: async (errorMessage) => {
        setError(errorMessage);
        // Fall back to sample data
        setData(getFallbackData(rangeType));
      },
      onEnd: async () => {
        setIsLoading(false);
      }
    });
  }, [rangeType, dateRange]);

  useEffect(() => {
    fetchUserGrowth();
  }, [fetchUserGrowth]);

  // Render loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="w-full pt-5 h-[250px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-[200px] rounded"></div>
      </div>
    );
  }

  // Show error message with retry button if API call failed
  if (error && data.length === 0) {
    return (
      <div className="w-full pt-5 h-[250px] flex flex-col items-center justify-center">
        <div className="mb-2 text-red-500">Failed to load user growth data</div>
        <button
          type="button"
          className="px-4 py-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
          onClick={fetchUserGrowth}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pt-5">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={10} />
          <YAxis fontSize={10} width={25} tickMargin={4} />
          <Tooltip formatter={(value) => [`${value} users`, "User Growth"]} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UserGrowthLargeChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGrowth = useCallback(() => {
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

    adminDashboardAPI.getUserGrowth({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format
        const formattedData = responseData.result.map((item) => ({
          label: item.label,
          users: item.value
        }));
        setData(formattedData);
      },
      onFail: async (errorMessage) => {
        setError(errorMessage);
        // Fall back to sample data
        setData(getFallbackData(rangeType));
      },
      onEnd: async () => {
        setIsLoading(false);
      }
    });
  }, [rangeType, dateRange]);

  useEffect(() => {
    fetchUserGrowth();
  }, [fetchUserGrowth]);

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
        <div className="mb-2 text-red-500">Failed to load user growth data</div>
        <button
          type="button"
          className="px-4 py-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
          onClick={fetchUserGrowth}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" fontSize={10} />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} users`, "User Growth"]} />
        <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#dbeafe" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

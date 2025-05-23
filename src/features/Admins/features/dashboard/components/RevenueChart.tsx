import { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { RevenueItem } from "@/features/Admins/types/apiType";

// Fallback data in case API fails
function getFallbackData(rangeType: "Daily" | "Weekly" | "Monthly" | "Custom"): ChartData[] {
  const fallbackData = {
    Daily: [
      { label: "Mon", value: 500000 },
      { label: "Tue", value: 700000 },
      { label: "Wed", value: 600000 },
      { label: "Thu", value: 800000 },
      { label: "Fri", value: 1200000 },
      { label: "Sat", value: 900000 },
      { label: "Sun", value: 750000 }
    ],
    Weekly: [
      { label: "Week 1", value: 3500000 },
      { label: "Week 2", value: 4200000 },
      { label: "Week 3", value: 3800000 },
      { label: "Week 4", value: 4500000 }
    ],
    Monthly: [
      { label: "Jan", value: 12000000 },
      { label: "Feb", value: 10000000 },
      { label: "Mar", value: 15000000 },
      { label: "Apr", value: 17000000 },
      { label: "May", value: 19000000 },
      { label: "Jun", value: 16000000 },
      { label: "Jul", value: 18000000 },
      { label: "Aug", value: 20000000 },
      { label: "Sep", value: 22000000 },
      { label: "Oct", value: 19000000 },
      { label: "Nov", value: 21000000 },
      { label: "Dec", value: 25000000 }
    ],
    Custom: [
      { label: "Apr 1", value: 5000000 },
      { label: "Apr 8", value: 6500000 },
      { label: "Apr 15", value: 7800000 },
      { label: "Apr 22", value: 8200000 },
      { label: "Apr 29", value: 8900000 },
      { label: "May 6", value: 9500000 }
    ]
  };

  if (rangeType === "Monthly") {
    return fallbackData.Monthly;
  } else if (rangeType === "Weekly") {
    return fallbackData.Weekly;
  } else if (rangeType === "Daily") {
    return fallbackData.Daily;
  } else if (rangeType === "Custom") {
    return fallbackData.Custom;
  }

  return fallbackData.Monthly; // Default fallback
}

interface Props {
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom";
  dateRange: DateRange | undefined;
}

interface ChartData {
  label: string;
  value: number;
}

export function RevenueMiniBarChart({ rangeType, dateRange }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(() => {
    // Convert rangeType to the expected API parameter
    let period: "daily" | "weekly" | "monthly" | "custom" = "monthly";
    const query: { period?: "daily" | "weekly" | "monthly" | "custom"; start_date?: string; end_date?: string } = {};

    if (rangeType === "Daily") {
      period = "daily";
    } else if (rangeType === "Weekly") {
      period = "weekly";
    } else if (rangeType === "Custom" && dateRange?.from && dateRange?.to) {
      period = "custom";
      // Format dates as YYYY-MM-DD for API
      query.start_date = dateRange.from.toISOString().split("T")[0];
      query.end_date = dateRange.to.toISOString().split("T")[0];
    } else {
      period = "monthly";
    }

    query.period = period;

    adminDashboardAPI.getRevenue({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format
        const formattedData = responseData.result.map((item: RevenueItem) => ({
          label: item.label,
          value: item.value
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
  }, [rangeType, dateRange]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Render loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="h-[300px] mt-4 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-[250px] rounded"></div>
      </div>
    );
  }

  // Show error message with retry button if API call failed
  if (error && data.length === 0) {
    return (
      <div className="h-[300px] mt-4 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-2">Failed to load revenue data</div>
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={fetchRevenue}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={10} />
          <YAxis
            fontSize={10}
            width={25}
            tickMargin={4}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
          <Bar dataKey="value" fill="#5a3295" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueLargeBarChart({ rangeType, dateRange }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(() => {
    console.log("Fetching revenue data", rangeType, dateRange);
    // Convert rangeType to the expected API parameter
    let period: "daily" | "weekly" | "monthly" | "custom" = "monthly";
    const query: { period?: "daily" | "weekly" | "monthly" | "custom"; start_date?: string; end_date?: string } = {};

    if (rangeType === "Daily") {
      period = "daily";
    } else if (rangeType === "Weekly") {
      period = "weekly";
    } else if (rangeType === "Custom" && dateRange?.from && dateRange?.to) {
      period = "custom";
      // Format dates as YYYY-MM-DD for API
      query.start_date = dateRange.from.toISOString().split("T")[0];
      query.end_date = dateRange.to.toISOString().split("T")[0];
    } else {
      period = "monthly";
    }

    query.period = period;

    adminDashboardAPI.getRevenue({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format
        const formattedData = responseData.result.map((item: RevenueItem) => ({
          label: item.label,
          value: item.value
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
  }, [rangeType, dateRange]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

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
        <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={fetchRevenue}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
        <Tooltip formatter={(value) => `${value.toLocaleString()}₫`} />
        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

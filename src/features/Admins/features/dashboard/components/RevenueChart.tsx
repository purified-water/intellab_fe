import { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { RevenueItem } from "@/features/Admins/types/apiType";

// Fallback data in case API fails
function getFallbackData(rangeType: "Month" | "Year" | "Custom"): ChartData[] {
  const fallbackData = {
    Month: [
      { label: "1", value: 400000 },
      { label: "2", value: 520000 },
      { label: "3", value: 380000 },
      { label: "4", value: 650000 },
      { label: "5", value: 720000 },
      { label: "6", value: 580000 },
      { label: "7", value: 800000 },
      { label: "8", value: 750000 },
      { label: "9", value: 680000 },
      { label: "10", value: 900000 },
      { label: "11", value: 620000 },
      { label: "12", value: 950000 },
      { label: "13", value: 730000 },
      { label: "14", value: 850000 },
      { label: "15", value: 780000 },
      { label: "16", value: 1100000 },
      { label: "17", value: 820000 },
      { label: "18", value: 920000 },
      { label: "19", value: 700000 },
      { label: "20", value: 1050000 },
      { label: "21", value: 890000 },
      { label: "22", value: 1200000 },
      { label: "23", value: 950000 },
      { label: "24", value: 1150000 },
      { label: "25", value: 980000 },
      { label: "26", value: 1300000 },
      { label: "27", value: 1080000 },
      { label: "28", value: 1250000 },
      { label: "29", value: 1120000 },
      { label: "30", value: 1400000 }
    ],
    Year: [
      { label: "Jan", value: 18000000 },
      { label: "Feb", value: 16000000 },
      { label: "Mar", value: 22000000 },
      { label: "Apr", value: 25000000 },
      { label: "May", value: 28000000 },
      { label: "Jun", value: 24000000 },
      { label: "Jul", value: 26000000 },
      { label: "Aug", value: 30000000 },
      { label: "Sep", value: 32000000 },
      { label: "Oct", value: 28000000 },
      { label: "Nov", value: 31000000 },
      { label: "Dec", value: 35000000 }
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

  if (rangeType === "Month") {
    return fallbackData.Month;
  } else if (rangeType === "Year") {
    return fallbackData.Year;
  } else if (rangeType === "Custom") {
    return fallbackData.Custom;
  }

  return fallbackData.Month; // Default fallback
}

interface Props {
  rangeType: "Month" | "Year" | "Custom";
  dateRange: DateRange | undefined;
  selectedMonth?: number;
  selectedYear?: number;
}

interface ChartData {
  label: string;
  value: number;
}

export function RevenueMiniBarChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(() => {
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
  }, [rangeType, dateRange, selectedMonth, selectedYear]);

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

export function RevenueLargeBarChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(() => {
    console.log("Fetching revenue data", rangeType, dateRange);
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
  }, [rangeType, dateRange, selectedMonth, selectedYear]);

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
        <Bar dataKey="value" fill="#5a3295" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

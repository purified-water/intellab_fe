import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { DateRange } from "react-day-picker";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { SubscriptionGrowthItem } from "@/features/Admins/types/apiType";

interface Props {
  rangeType: "Daily" | "Weekly" | "Month" | "Year" | "Custom";
  dateRange: DateRange | undefined;
  selectedMonth?: number;
  selectedYear?: number;
}

interface ChartData {
  label: string;
  subscriptions: number;
}

// Helper function to map API data to readable labels
const mapDataToReadableLabels = (
  data: SubscriptionGrowthItem[],
  rangeType: "Daily" | "Weekly" | "Month" | "Year" | "Custom"
): ChartData[] => {
  if (rangeType === "Month") {
    // For Month view, use API response labels (e.g., "W22 2025", "W23 2025")
    return data.map((item) => ({
      label: item.label,
      subscriptions: item.value
    }));
  } else if (rangeType === "Year") {
    // For Year view, map to month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return data.map((item, index) => ({
      label: monthNames[index] || item.label,
      subscriptions: item.value
    }));
  } else {
    // For Custom range, format labels to show only date numbers (e.g., "Apr 1" -> "1")
    return data.map((item) => ({
      label: item.label.split("-")[0] || item.label, // Extract the last part (day number)
      subscriptions: item.value
    }));
  }
};

export function SubscriptionGrowthMiniChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionGrowth = useCallback(() => {
    // Convert rangeType to the expected API parameter (following same pattern as Revenue chart)
    let period: "monthly" | "yearly" | "custom" = "monthly";
    const query: { period?: "monthly" | "yearly" | "custom"; start_date?: string; end_date?: string } = {};

    if (rangeType === "Month") {
      period = "monthly";
      if (selectedMonth !== undefined && selectedYear !== undefined) {
        // Calculate date range for the selected month to get specific monthly data
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);

        // Format dates without timezone conversion issues
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        query.start_date = formatDate(startDate);
        query.end_date = formatDate(endDate);
      }
      // If no specific month selected, API will default to current month
    } else if (rangeType === "Year" && selectedYear !== undefined) {
      period = "yearly";
      // Use yearly period with year range: <year>-01-01 to <year>-12-31
      query.start_date = `${selectedYear}-01-01`;
      query.end_date = `${selectedYear}-12-31`;
    } else if (rangeType === "Custom" && dateRange?.from && dateRange?.to) {
      period = "custom";
      // Format dates as YYYY-MM-DD for API without timezone conversion issues
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      query.start_date = formatDate(dateRange.from);
      query.end_date = formatDate(dateRange.to);
    } else {
      period = "monthly";
    }

    query.period = period;

    adminDashboardAPI.getSubscriptionGrowth({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Handle both new nested API response and old array format
        const dataArray = responseData.result?.data || responseData.result;

        if (!Array.isArray(dataArray)) {
          console.error("API response data is not an array:", dataArray);
          setData(getFallbackData(rangeType));
          return;
        }

        // Transform API data to chart format with readable labels
        const formattedData = mapDataToReadableLabels(dataArray, rangeType);
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
    fetchSubscriptionGrowth();
  }, [fetchSubscriptionGrowth]);

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
        <div className="mb-2 text-red-500">Failed to load subscription data</div>
        <button
          className="px-4 py-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
          onClick={fetchSubscriptionGrowth}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pt-5">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={10} />
          <YAxis fontSize={10} width={25} tickMargin={4} />
          <Tooltip
            formatter={(value) => [`${value} subscribers`, "Subscriptions"]}
            labelFormatter={(label) => `${label}`}
          />
          <Line type="monotone" dataKey="subscriptions" stroke="#5a3295" strokeWidth={2} name="Subscriptions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubscriptionGrowthLargeChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionGrowth = useCallback(() => {
    // Convert rangeType to the expected API parameter (following same pattern as Revenue chart)
    let period: "monthly" | "yearly" | "custom" = "monthly";
    const query: { period?: "monthly" | "yearly" | "custom"; start_date?: string; end_date?: string } = {};

    if (rangeType === "Month") {
      period = "monthly";
      if (selectedMonth !== undefined && selectedYear !== undefined) {
        // Calculate date range for the selected month to get specific monthly data
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);

        // Format dates without timezone conversion issues
        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        query.start_date = formatDate(startDate);
        query.end_date = formatDate(endDate);
      }
      // If no specific month selected, API will default to current month
    } else if (rangeType === "Year" && selectedYear !== undefined) {
      period = "yearly";
      // Use yearly period with year range: <year>-01-01 to <year>-12-31
      query.start_date = `${selectedYear}-01-01`;
      query.end_date = `${selectedYear}-12-31`;
    } else if (rangeType === "Custom" && dateRange?.from && dateRange?.to) {
      period = "custom";
      // Format dates as YYYY-MM-DD for API without timezone conversion issues
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      query.start_date = formatDate(dateRange.from);
      query.end_date = formatDate(dateRange.to);
    } else {
      period = "monthly";
    }

    query.period = period;

    adminDashboardAPI.getSubscriptionGrowth({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Handle both new nested API response and old array format
        const dataArray = responseData.result?.data || responseData.result;

        if (!Array.isArray(dataArray)) {
          console.error("API response data is not an array:", dataArray);
          setData(getFallbackData(rangeType));
          return;
        }

        // Transform API data to chart format with readable labels
        const formattedData = mapDataToReadableLabels(dataArray, rangeType);
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
    fetchSubscriptionGrowth();
  }, [fetchSubscriptionGrowth]);

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
        <div className="mb-2 text-red-500">Failed to load subscription data</div>
        <button
          className="px-4 py-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
          onClick={fetchSubscriptionGrowth}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" fontSize={10} />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value} subscribers`, "Subscriptions"]}
          labelFormatter={(label) => `${label}`}
        />
        <Line type="monotone" dataKey="subscriptions" stroke="#5a3295" strokeWidth={3} name="Subscriptions" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Fallback data in case API fails
function getFallbackData(rangeType: "Daily" | "Weekly" | "Month" | "Year" | "Custom"): ChartData[] {
  const fallbackData = {
    Month: [
      { label: "1", subscriptions: 5 },
      { label: "2", subscriptions: 8 },
      { label: "3", subscriptions: 6 },
      { label: "4", subscriptions: 10 },
      { label: "5", subscriptions: 12 },
      { label: "6", subscriptions: 9 },
      { label: "7", subscriptions: 15 },
      { label: "8", subscriptions: 18 },
      { label: "9", subscriptions: 14 },
      { label: "10", subscriptions: 20 },
      { label: "11", subscriptions: 16 },
      { label: "12", subscriptions: 22 },
      { label: "13", subscriptions: 19 },
      { label: "14", subscriptions: 25 },
      { label: "15", subscriptions: 21 },
      { label: "16", subscriptions: 28 },
      { label: "17", subscriptions: 24 },
      { label: "18", subscriptions: 30 },
      { label: "19", subscriptions: 26 },
      { label: "20", subscriptions: 32 },
      { label: "21", subscriptions: 29 },
      { label: "22", subscriptions: 35 },
      { label: "23", subscriptions: 31 },
      { label: "24", subscriptions: 38 },
      { label: "25", subscriptions: 34 },
      { label: "26", subscriptions: 40 },
      { label: "27", subscriptions: 36 },
      { label: "28", subscriptions: 42 },
      { label: "29", subscriptions: 39 },
      { label: "30", subscriptions: 45 }
    ],
    Weekly: [
      { label: "Week 1", subscriptions: 30 },
      { label: "Week 2", subscriptions: 40 },
      { label: "Week 3", subscriptions: 50 },
      { label: "Week 4", subscriptions: 60 }
    ],
    Daily: [
      { label: "Mon", subscriptions: 10 },
      { label: "Tue", subscriptions: 15 },
      { label: "Wed", subscriptions: 12 },
      { label: "Thu", subscriptions: 18 },
      { label: "Fri", subscriptions: 20 }
    ],
    Year: [
      { label: "Jan", subscriptions: 120 },
      { label: "Feb", subscriptions: 135 },
      { label: "Mar", subscriptions: 155 },
      { label: "Apr", subscriptions: 180 },
      { label: "May", subscriptions: 195 },
      { label: "Jun", subscriptions: 210 },
      { label: "Jul", subscriptions: 190 },
      { label: "Aug", subscriptions: 205 },
      { label: "Sep", subscriptions: 220 },
      { label: "Oct", subscriptions: 235 },
      { label: "Nov", subscriptions: 250 },
      { label: "Dec", subscriptions: 265 }
    ],
    Custom: [
      { label: "Apr 1", subscriptions: 10 },
      { label: "Apr 8", subscriptions: 15 },
      { label: "Apr 15", subscriptions: 18 },
      { label: "Apr 22", subscriptions: 22 },
      { label: "Apr 29", subscriptions: 25 },
      { label: "May 6", subscriptions: 28 }
    ]
  };

  return fallbackData[rangeType] || fallbackData.Month;
}

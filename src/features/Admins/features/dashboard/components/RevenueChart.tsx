import { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { RevenueItem } from "@/features/Admins/types/apiType";

// Fallback data in case API fails
function getFallbackData(rangeType: "Month" | "Year" | "Custom"): ChartData[] {
  const fallbackData = {
    Month: [
      { label: "W1", value: 2500000 },
      { label: "W2", value: 3200000 },
      { label: "W3", value: 2800000 },
      { label: "W4", value: 3500000 }
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

// Helper function to map API data to readable labels
const mapDataToReadableLabels = (data: RevenueItem[], rangeType: "Month" | "Year" | "Custom"): ChartData[] => {
  if (rangeType === "Month") {
    // For Month view, use API response labels (e.g., "W22 2025", "W23 2025")
    return data.map((item) => ({
      label: item.label,
      value: item.value
    }));
  } else if (rangeType === "Year") {
    // For Year view, map to month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return data.map((item, index) => ({
      label: monthNames[index] || item.label,
      value: item.value
    }));
  } else {
    // For Custom range, format labels to show only date numbers (e.g., "Apr 1" -> "1")
    return data.map((item) => ({
      label: item.label.split("-")[0] || item.label, // Extract the last part (day number)
      value: item.value
    }));
  }
};

export function RevenueMiniBarChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(() => {
    // Convert rangeType to the expected API parameter
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

    adminDashboardAPI.getRevenue({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Check if result has data property (for newer API structure)
        const dataArray = responseData.result?.data || responseData.result;

        // Transform API data to chart format with readable labels
        if (Array.isArray(dataArray)) {
          const formattedData = mapDataToReadableLabels(dataArray, rangeType);
          setData(formattedData);
        } else {
          console.error("API response data is not an array:", dataArray);
          setData(getFallbackData(rangeType));
        }
      },
      onFail: async (errorMessage) => {
        setError(errorMessage);
        // Fall back to sample data if API fails
        setData(getFallbackData(rangeType));
        console.error("Failed to fetch revenue data:", errorMessage);
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
        <div className="mb-2 text-red-500">Failed to load revenue data</div>
        <button
          type="button"
          className="px-4 py-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
          onClick={fetchRevenue}
        >
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
          <Tooltip
            formatter={(value) => [`${value.toLocaleString()} VND`, "Value"]}
            labelFormatter={(label) => `${label}`}
          />
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
    // Convert rangeType to the expected API parameter
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

    adminDashboardAPI.getRevenue({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Transform API data to chart format with readable labels
        // Check if result has data property (for newer API structure)
        const dataArray = responseData.result?.data || responseData.result;

        if (Array.isArray(dataArray)) {
          const formattedData = mapDataToReadableLabels(dataArray, rangeType);
          setData(formattedData);
        } else {
          console.error("Revenue API response data is not an array:", dataArray);
          setData(getFallbackData(rangeType));
        }
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
        <div className="mb-2 text-red-500">Failed to load revenue data</div>
        <button
          type="button"
          className="px-4 py-2 text-red-700 bg-red-100 rounded hover:bg-red-200"
          onClick={fetchRevenue}
        >
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
        <Tooltip
            formatter={(value) => [`${value.toLocaleString()} VND`, "Value"]}
            labelFormatter={(label) => `${label}`}
          />
        <Bar dataKey="value" fill="#5a3295" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

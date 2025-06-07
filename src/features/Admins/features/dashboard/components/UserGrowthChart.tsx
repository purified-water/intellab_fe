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

interface ApiDataItem {
  label: string;
  value: number;
}

// Helper function to map API data to readable labels
const mapDataToReadableLabels = (data: ApiDataItem[], rangeType: "Month" | "Year" | "Custom"): ChartData[] => {
  if (rangeType === "Month") {
    // For Month view, use API response labels (e.g., "W22 2025", "W23 2025")
    return data.map((item) => ({
      label: item.label,
      users: item.value
    }));
  } else if (rangeType === "Year") {
    // For Year view, map to month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return data.map((item, index) => ({
      label: monthNames[index] || item.label,
      users: item.value
    }));
  } else {
    // For Custom range, format labels to show only date numbers (e.g., "Apr 1" -> "1")
    return data.map((item) => ({
      label: item.label.split("-")[0] || item.label, // Extract the last part (day number)
      users: item.value
    }));
  }
};

// Function to get fallback data if the API fails
const getFallbackData = (rangeType: string): ChartData[] => {
  const fallbackData: ChartData[] = [];

  if (rangeType === "Month") {
    // Weekly fallback data for Month view
    return [
      { label: "W1", users: 45 },
      { label: "W2", users: 52 },
      { label: "W3", users: 48 },
      { label: "W4", users: 58 }
    ];
  } else if (rangeType === "Year") {
    // Simple yearly fallback data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach((month, index) => {
      fallbackData.push({ label: month, users: 50 + index * 10 });
    });
  } else {
    // Custom range fallback data
    return [
      { label: "Period 1", users: 40 },
      { label: "Period 2", users: 55 },
      { label: "Period 3", users: 62 }
    ];
  }

  return fallbackData;
};

export function UserGrowthMiniChart({ rangeType, dateRange, selectedMonth, selectedYear }: Props) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserGrowth = useCallback(() => {
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

    adminDashboardAPI.getUserGrowth({
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
          console.error("UserGrowth API response data is not an array:", dataArray);
          setData(getFallbackData(rangeType));
        }
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
  }, [rangeType, dateRange, selectedMonth, selectedYear]);

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

    adminDashboardAPI.getUserGrowth({
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
          console.error("UserGrowth API response data is not an array:", dataArray);
          setData(getFallbackData(rangeType));
        }
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
  }, [rangeType, dateRange, selectedMonth, selectedYear]);

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

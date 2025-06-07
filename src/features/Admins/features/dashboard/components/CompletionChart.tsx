import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DateRange } from "react-day-picker";
import { adminDashboardAPI } from "@/lib/api/adminDashboardAPI";
import { CourseCompletionRateItem } from "@/features/Admins/types/apiType";

// Helper function to map API data to readable labels
const mapDataToReadableLabels = (
  data: CourseCompletionRateItem[],
  rangeType: "Month" | "Year" | "Custom"
): ChartData[] => {
  if (rangeType === "Month") {
    // For Month view, use API response labels (e.g., "W22 2025", "W23 2025")
    return data.map((item) => ({
      label: item.label,
      completionRate: item.value
    }));
  } else if (rangeType === "Year") {
    // For Year view, map to month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return data.map((item, index) => ({
      label: monthNames[index] || item.label,
      completionRate: item.value
    }));
  } else {
    // For Custom range, format labels to show only date numbers (e.g., "Apr 1" -> "1")
    return data.map((item) => ({
      label: item.label.split("-")[0] || item.label, // Extract the last part (day number)
      completionRate: item.value
    }));
  }
};

function getFallbackData(rangeType: "Month" | "Year" | "Custom") {
  // Fallback data in case API fails
  const fallbackData = {
    Month: [
      { label: "W22 2025", completionRate: 72 },
      { label: "W23 2025", completionRate: 78 },
      { label: "W24 2025", completionRate: 75 },
      { label: "W25 2025", completionRate: 82 }
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
  rangeType: "Month" | "Year" | "Custom";
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
      // Use yearly period with date range for the selected year
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

    adminDashboardAPI.getCourseCompletionRate({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Handle both new nested API response and old array format
        const dataArray = responseData.result?.data || responseData.result;

        if (!Array.isArray(dataArray)) {
          console.error("CompletionRate API response data is not an array:", dataArray);
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
      // Use yearly period with date range for the selected year
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

    adminDashboardAPI.getCourseCompletionRate({
      query,
      onStart: async () => {
        setIsLoading(true);
        setError(null);
      },
      onSuccess: async (responseData) => {
        // Handle both new nested API response and old array format
        const dataArray = responseData.result?.data || responseData.result;

        if (!Array.isArray(dataArray)) {
          console.error("CompletionRate API response data is not an array:", dataArray);
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

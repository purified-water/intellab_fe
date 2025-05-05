import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DateRange } from "react-day-picker";

function getDataBasedOnFilter(rangeType: "Daily" | "Weekly" | "Monthly" | "Custom", dateRange: any) {
  // Mock data for demonstration purposes
  const mockData = {
    Daily: [
      { label: "Mon", completionRate: 75 },
      { label: "Tue", completionRate: 78 },
      { label: "Wed", completionRate: 80 },
      { label: "Thu", completionRate: 77 },
      { label: "Fri", completionRate: 82 },
      { label: "Sat", completionRate: 85 },
      { label: "Sun", completionRate: 79 },
    ],
    Weekly: [
      { label: "Week 1", completionRate: 72 },
      { label: "Week 2", completionRate: 75 },
      { label: "Week 3", completionRate: 78 },
      { label: "Week 4", completionRate: 80 },
    ],
    Monthly: [
      { label: "Jan", completionRate: 70 },
      { label: "Feb", completionRate: 72 },
      { label: "Mar", completionRate: 68 },
      { label: "Apr", completionRate: 75 },
      { label: "May", completionRate: 80 },
      { label: "Jun", completionRate: 78 },
      { label: "Jul", completionRate: 82 },
      { label: "Aug", completionRate: 79 },
      { label: "Sep", completionRate: 85 },
      { label: "Oct", completionRate: 83 },
      { label: "Nov", completionRate: 86 },
      { label: "Dec", completionRate: 88 },
    ],
    Custom: [
      // This would typically be filtered based on the dateRange
      { label: "Period 1", completionRate: 76 },
      { label: "Period 2", completionRate: 79 },
      { label: "Period 3", completionRate: 84 },
    ]
  };

  // Return data based on the rangeType
  return mockData[rangeType] || mockData["Monthly"];
}

interface Props {
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom";
  dateRange: DateRange | undefined;
}

export function CompletionRateMiniChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange);

  return (
    <div className="h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" fontSize={10} />
          <YAxis 
            domain={[0, 100]} 
            fontSize={10} 
            width={25} 
            tickMargin={4} 
          />
          <Tooltip formatter={(value) => `${value}%`} />
          <defs>
            <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="completionRate" 
            stroke="#22c55e" 
            fill="url(#completionGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionRateLargeChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis 
          domain={[0, 100]}
        />
        <Tooltip formatter={(value) => `${value}%`} />
        <defs>
          <linearGradient id="completionGradientLarge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="completionRate" 
          stroke="#22c55e" 
          fill="url(#completionGradientLarge)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function getDataBasedOnFilter(rangeType: "Daily" | "Weekly" | "Monthly" | "Custom", dateRange: any) {
  // Mock data for demonstration purposes
  const mockData = {
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
      // This would typically be filtered based on the dateRange
      { label: "Custom 1", value: 5000000 },
      { label: "Custom 2", value: 7000000 },
      { label: "Custom 3", value: 9000000 }
    ]
  };

  // Return data based on the rangeType
  return mockData[rangeType] || mockData["Monthly"];
}

interface Props {
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom";
  dateRange: any;
}

export function RevenueMiniBarChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange);

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
  const data = getDataBasedOnFilter(rangeType, dateRange);

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

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/shadcn/card";
import { motion } from "framer-motion";
import { getDataBasedOnFilter } from "./getDataBasedOnFilter";

const data = [
  { month: "Jan", subscriptions: 100 },
  { month: "Feb", subscriptions: 130 },
  { month: "Mar", subscriptions: 150 },
  { month: "Apr", subscriptions: 170 },
  { month: "May", subscriptions: 180 },
  { month: "Jun", subscriptions: 200 }
];

interface Props {
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom";
  dateRange: any;
}

export function SubscriptionGrowthMiniChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange); // Function to filter data based on rangeType and dateRange

  return (
    <div className="w-full pt-5">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={rangeType === "Daily" ? "day" : rangeType === "Weekly" ? "week" : "month"}
            fontSize={10}
          />{" "}
          <YAxis fontSize={10} width={25} tickMargin={4} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="subscriptions"
            stroke="#22c55e"
            strokeWidth={2}
            activeDot={{ r: 4 }}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubscriptionGrowthLargeChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange); // Function to filter data based on rangeType and dateRange

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={rangeType === "Daily" ? "day" : rangeType === "Weekly" ? "week" : "month"} fontSize={10} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="subscriptions" stroke="#22c55e" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

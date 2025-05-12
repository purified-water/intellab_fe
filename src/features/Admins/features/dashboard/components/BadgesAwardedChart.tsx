import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getDataBasedOnFilter } from "./getDataBasedOnFilter";
import { DateRange } from "react-day-picker";

// const badgesData = [
//   { month: "Jan", badges: 40 },
//   { month: "Feb", badges: 55 },
//   { month: "Mar", badges: 60 },
//   { month: "Apr", badges: 80 },
//   { month: "May", badges: 70 }
// ];

interface Props {
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom";
  dateRange: DateRange | undefined;
}

export function BadgesAwardedMiniChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange); // Function to filter data based on rangeType and dateRange

  return (
    <div className="w-full pt-5">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <Tooltip />
          <Bar dataKey="badges" fill="#10b981" radius={[4, 4, 0, 0]} />
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey={rangeType === "Daily" ? "day" : rangeType === "Weekly" ? "week" : "month"} fontSize={10} />
          <YAxis fontSize={10} width={25} tickMargin={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BadgesAwardedLargeChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange); // Function to filter data based on rangeType and dateRange

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={rangeType === "Daily" ? "day" : rangeType === "Weekly" ? "week" : "month"} fontSize={10} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="badges" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

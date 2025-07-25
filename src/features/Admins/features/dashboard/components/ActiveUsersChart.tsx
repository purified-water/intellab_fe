import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getDataBasedOnFilter } from "./getDataBasedOnFilter";
import { DateRange } from "react-day-picker";

// const activeUsersData = [
//   { hour: "00:00", users: 5 },
//   { hour: "03:00", users: 15 },
//   { hour: "06:00", users: 30 },
//   { hour: "09:00", users: 45 },
//   { hour: "12:00", users: 50 },
//   { hour: "15:00", users: 40 },
//   { hour: "18:00", users: 70 },
//   { hour: "21:00", users: 60 }
// ];

interface Props {
  rangeType: "Month" | "Custom";
  dateRange: DateRange | undefined;
}

export function ActiveUsersTodayMiniChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange); // Function to filter data based on rangeType and dateRange
  return (
    <div className="w-full pt-5">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <Area type="monotone" dataKey="users" stroke="#5a3295" fill="rgba(90, 50, 149, 0.1)" strokeWidth={2} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={rangeType === "Month" ? "month" : "custom"} fontSize={10} />{" "}
          <YAxis fontSize={10} width={25} tickMargin={4} />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActiveUsersTodayLargeChart({ rangeType, dateRange }: Props) {
  const data = getDataBasedOnFilter(rangeType, dateRange); // Function to filter data based on rangeType and dateRange

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={rangeType === "Month" ? "month" : "custom"} fontSize={10} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="users" stroke="#5a3295" fill="rgba(90, 50, 149, 0.1)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

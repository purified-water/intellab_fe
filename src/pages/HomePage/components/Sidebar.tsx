import { Calendar } from "@/components/ui/Calendar";
import { useState } from "react";
import { ProgressCircle } from "./ProgressCircle";
import { Leaderboard } from "./Leaderboard";

export const Sidebar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex-col items-center space-y-8">
      <Calendar mode="single" selected={date} onSelect={setDate} className="overflow-auto border rounded-md" />
      <ProgressCircle />
      <Leaderboard />
    </div>
  );
};

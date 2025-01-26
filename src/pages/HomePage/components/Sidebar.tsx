import { Calendar } from "@/components/ui/Calendar";
import { useState } from "react";
import { ProgressCircle } from "./ProgressCircle";
import { Leaderboard } from "./Leaderboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

export const Sidebar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="flex-col items-center space-y-8">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="overflow-auto border border-gray5 rounded-md"
      />
      {isAuthenticated && <ProgressCircle />}
      <Leaderboard />
    </div>
  );
};

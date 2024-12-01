import { Calendar } from "@/components/ui/Calendar";
import { useState } from "react";

export const Sidebar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex-col items-center space-y-8">
      <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />

      {/* Progress */}
      <div className="p-4 border rounded">
        <p className="font-bold">Your Progress</p>
        <p>Solved: 15/120</p>
        <p>Easy: 5/30</p>
        <p>Medium: 10/70</p>
        <p>Hard: 0/20</p>
      </div>
      {/* Leaderboard */}
      <div className="p-4 border rounded">
        <p className="font-bold">Leaderboard</p>
        <ol>
          <li>#1 Julianng1110 - 1200</li>
          <li>#2 Julianng1110 - 1200</li>
          <li>#3 Julianng1110 - 1200</li>
        </ol>
        <a href="#" className="text-purple-500">
          View more...
        </a>
      </div>
    </div>
  );
};

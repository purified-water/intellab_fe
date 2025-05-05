import { cn } from "@/lib/utils"; // hoặc tự viết 1 hàm nối className nếu không có
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TopStatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeNote: string;
  changeType: "increase" | "decrease";
}

export function TopStatCard({ title, value, icon: Icon, change, changeNote, changeType }: TopStatCardProps) {
  const isIncrease = changeType === "increase";

  return (
    <div className="rounded-lg border p-4 flex flex-col gap-2 shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-black">{title}</h3>
        <Icon className="w-5 h-5 text-black" />
      </div>

      <div className="text-2xl font-bold text-black">{value}</div>

      <div className={cn("text-xs flex items-center", isIncrease ? "text-green-600" : "text-red-500")}>
        {isIncrease ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change} {changeNote}
      </div>
    </div>
  );
}

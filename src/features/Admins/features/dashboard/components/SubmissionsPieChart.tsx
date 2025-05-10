import { DateRange } from "react-day-picker";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function getDataBasedOnFilter(rangeType: "Daily" | "Weekly" | "Monthly" | "Custom", _dateRange: DateRange | undefined) {
  // Mock data for demonstration purposes
  const mockData = {
    Daily: [
      { name: "Successful", value: 90 },
      { name: "Failed", value: 10 }
    ],
    Weekly: [
      { name: "Successful", value: 85 },
      { name: "Failed", value: 15 }
    ],
    Monthly: [
      { name: "Successful", value: 80 },
      { name: "Failed", value: 20 }
    ],
    Custom: [
      { name: "Successful", value: 75 },
      { name: "Failed", value: 25 }
    ]
  };

  // Return data based on the rangeType
  return mockData[rangeType] || mockData["Daily"];
}

interface Props {
  rangeType: "Daily" | "Weekly" | "Monthly" | "Custom";
  dateRange: DateRange | undefined;
}

export function SubmissionsPieChart({ rangeType, dateRange }: Props) {
  // Chức năng lọc dữ liệu (có thể thay đổi theo bộ lọc, ví dụ như Weekly, Monthly)
  const filteredData = getDataBasedOnFilter(rangeType, dateRange);

  const COLORS = ["#22c55e", "#f43f5e"]; // Xanh thành công - Đỏ thất bại

  return (
    <div className="w-full pt-5 flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={filteredData} dataKey="value" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}>
            {filteredData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend dưới Pie */}
      <div className="flex gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Success</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Failed</span>
        </div>
      </div>
    </div>
  );
}

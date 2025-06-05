import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/Button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/shadcn/select";
import { Maximize2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/DatePickerWithRange";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";

interface ZoomableChartCardProps {
  title: string;
  children: React.ReactNode;
  largeChart: React.ReactNode;
  rangeType: "Month" | "Year" | "Custom";
  dateRange: DateRange | undefined;
  selectedMonth: number;
  selectedYear: number;
  setRangeType: (rangeType: "Month" | "Year" | "Custom") => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

export function ZoomableChartCard({
  title,
  children,
  largeChart,
  rangeType,
  dateRange,
  selectedMonth,
  selectedYear,
  setRangeType,
  setDateRange,
  setSelectedMonth,
  setSelectedYear
}: ZoomableChartCardProps) {
  const [open, setOpen] = useState(false);
  //   const [rangeType, setRangeType] = useState<"Daily" | "Weekly" | "Monthly">("Monthly");
  //   const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //     from: new Date(),
  //     to: new Date()
  //   });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="rounded-lg border p-4 relative shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold">{title}</h3>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-6 w-6 p-0">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </div>
          {children}
        </div>

        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center gap-4 mt-4">
            <Select value={rangeType} onValueChange={setRangeType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={rangeType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Month">Month</SelectItem>
                <SelectItem value="Year">Year</SelectItem>
                <SelectItem value="Custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {/* Month/Year Picker for Month and Year filters */}
            {(rangeType === "Month" || rangeType === "Year") && (
              <MonthYearPicker
                rangeType={rangeType}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthYearChange={(month, year) => {
                  setSelectedMonth(month);
                  setSelectedYear(year);
                }}
              />
            )}

            {/* Date Picker for Custom range */}
            {rangeType === "Custom" && <DatePickerWithRange date={dateRange} setDate={setDateRange} />}
          </div>

          <div className="h-[400px] mt-6">{largeChart}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}

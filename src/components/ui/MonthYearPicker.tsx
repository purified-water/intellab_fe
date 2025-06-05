import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/shadcn/select";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

interface MonthYearPickerProps {
  className?: string;
  selectedMonth: number; // 0-11 (January = 0)
  selectedYear: number;
  onMonthYearChange: (month: number, year: number) => void;
  rangeType?: "Month" | "Year"; // Add rangeType prop
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate years from 2020 to current year + 1
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

export function MonthYearPicker({ 
  className, 
  selectedMonth, 
  selectedYear, 
  onMonthYearChange,
  rangeType = "Month" // Default to Month
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMonthChange = (month: string) => {
    const monthIndex = months.indexOf(month);
    onMonthYearChange(monthIndex, selectedYear);
  };

  const handleYearChange = (year: string) => {
    onMonthYearChange(selectedMonth, parseInt(year));
  };

  const isYearOnly = rangeType === "Year";

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`justify-start text-left font-normal ${isYearOnly ? "w-[120px]" : "w-[200px]"}`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {isYearOnly ? selectedYear : `${months[selectedMonth]} ${selectedYear}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex gap-2">
            {!isYearOnly && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Month</label>
                <Select value={months[selectedMonth]} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="bg-appPrimary hover:bg-appPrimary/90"
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

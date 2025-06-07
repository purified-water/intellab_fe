import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  const [warning, setWarning] = useState<string>("");

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    if (!selectedDate?.from || !selectedDate?.to) {
      setDate(selectedDate);
      setWarning("");
      return;
    }

    // Check if the range exceeds 30 days
    const timeDiff = selectedDate.to.getTime() - selectedDate.from.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 30) {
      setWarning("Maximum range is 30 days. Range will be automatically adjusted.");
      
      // Auto-adjust the range
      const maxEndDate = new Date(selectedDate.from);
      maxEndDate.setDate(maxEndDate.getDate() + 30);
      
      const adjustedRange = {
        from: selectedDate.from,
        to: maxEndDate
      };
      
      setDate(adjustedRange);
    } else {
      setWarning("");
      setDate(selectedDate);
    }
  };

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range (max 30 days)</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            {warning && (
              <div className="mb-2 p-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded">
                {warning}
              </div>
            )}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

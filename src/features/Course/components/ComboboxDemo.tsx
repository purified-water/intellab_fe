"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";

interface IFilterOption {
  value: string;
  label: string;
}

// Reusing the sort component from the comment section for rating filter
const ratingFilters: IFilterOption[] = [
  { value: "all", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" }
];

interface ComboboxDemoProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function ComboboxDemo({ open, setOpen, value, setValue }: ComboboxDemoProps) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div role="combobox" aria-expanded={open} className="flex items-center space-x-2 cursor-pointer rounded-xl">
          <span className="font-normal">Filter by:</span>
          <span className="font-semibold ">{ratingFilters.find((rating) => rating.value === value)?.label}</span>
          <ChevronDown className="w-4 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {ratingFilters.map((rating) => (
                <CommandItem
                  key={rating.value}
                  value={rating.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === rating.value ? "opacity-100" : "opacity-0")} />
                  {rating.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

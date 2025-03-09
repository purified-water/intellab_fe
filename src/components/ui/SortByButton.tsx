import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";

export interface ISortByItem {
  value: string;
  label: string;
}

interface SortByButtonProps {
  items: ISortByItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  title?: string;
}

export const SortByButton = (props: SortByButtonProps) => {
  const { items, selectedValue, onSelect, title = "Sorted by:" } = props;

  const [sortByOpen, setSortByOpen] = useState(false);

  return (
    <Popover open={sortByOpen} onOpenChange={setSortByOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={sortByOpen}
          className="w-[200px] flex text-sm space-x-2 items-center cursor-pointer"
        >
          <span className="font-normal">{title}</span>
          <span className="font-semibold ">{items.find((item) => item.value === selectedValue)?.label}</span>
          <ChevronDown className="w-4 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No sort item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === selectedValue ? "" : currentValue);
                    setSortByOpen(false);
                  }}
                >
                  {item.label}
                  <Check className={selectedValue === item.value ? "opacity-100" : "opacity-0"} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
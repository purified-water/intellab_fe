import { ProblemComment } from "./ProblemComment";
import { Button } from "@/components/ui/shadcn/Button";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/shadcn/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { useState } from "react";

export const ProblemCommentSection = () => {
  const sortBys = [
    {
      value: "mostRecent",
      label: "Most Recent"
    },
    {
      value: "mostUpvoted",
      label: "Most Upvoted"
    },
    {
      value: "oldest",
      label: "Oldest"
    }
  ];
  const [sortByOpen, setSortByOpen] = useState(false);
  const [sortBy, setSortBy] = useState(sortBys[0].value);
  const comments = [
    {
      commentId: "1",
      name: "Tuan Nguyen",
      avatar: "",
      date: "Jan 22, 2025",
      content:
        "Hello all,\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().",
      replies: [
        {
          name: "John Nguyen",
          content:
            "Hello all,\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely",
          date: "Jan 22, 2025"
        },
        { name: "John Nguyen", content: "Come back bro", date: "Jan 22, 2025" }
      ]
    },

    {
      commentId: "2",
      name: "Tuan Nguyen",
      avatar: "",
      date: "Jan 22, 2025",
      content:
        "Hello all,\nI'm new coding and noob in using classes. Why no one is writing int main() in their codes? Definitely, there will be different versions in the main().",
      replies: [
        { name: "John Nguyen", content: "Come back bro", date: "Jan 22, 2025" },
        { name: "John Nguyen", content: "Come back bro", date: "Jan 22, 2025" }
      ]
    }
  ];

  return (
    <div className="h-full px-6 py-6 overflow-y-auto">
      <div className="">
        <textarea
          placeholder="Type your comment..."
          className="w-full text-sm px-4 py-2 bg-white border rounded-lg resize-none max-h-[300px] overflow-y-scroll border-gray4/60"
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
        />
        <div className="flex justify-end">
          <Button className="px-4 py-2 mt-2 text-white rounded-lg bg-appPrimary hover:bg-appPrimary/90">Comment</Button>
        </div>
      </div>

      {/* SORT BY BUTTON */}
      <Popover open={sortByOpen} onOpenChange={setSortByOpen}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={sortByOpen}
            className="w-[200px] flex text-sm space-x-2 items-center cursor-pointer"
          >
            <span className="font-normal">Sorted by:</span>
            <span className="font-semibold ">{sortBys.find((sortByItem) => sortByItem.value === sortBy)?.label}</span>
            <ChevronDown className="w-4 opacity-50" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No sort item found.</CommandEmpty>
              <CommandGroup>
                {sortBys.map((sortByItem) => (
                  <CommandItem
                    key={sortByItem.value}
                    value={sortByItem.value}
                    onSelect={(currentValue) => {
                      setSortBy(currentValue === sortBy ? "" : currentValue);
                      setSortByOpen(false);
                    }}
                  >
                    {sortByItem.label}
                    <Check className={sortBy === sortByItem.value ? "opacity-100" : "opacity-0"} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="mt-4">
        {comments.map((comment, index) => (
          <ProblemComment key={index} {...comment} />
        ))}
      </div>
    </div>
  );
};

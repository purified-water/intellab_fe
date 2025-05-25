import { Dialog, DialogContent } from "@/components/ui/shadcn/dialog";
import { useState } from "react";
import { Button } from "@/components/ui";
import { Category } from "@/types";
// import { Input, Select } from "@/components/ui/shadcn";
import { AdminProblemParams } from "../types/ProblemListType";

type Props = {
  isVisible: boolean;
  currentFilter: AdminProblemParams;
  onFilter: (filter: AdminProblemParams) => void;
  categories: Category;
};

export function FilterDialog({ isVisible, currentFilter, onFilter }: Props) {
  const [localFilter] = useState<AdminProblemParams>(currentFilter);

  const handleApply = () => {
    onFilter(localFilter);
  };

  return (
    <Dialog open={isVisible}>
      <DialogContent className="space-y-4 w-[400px]">
        <h2 className="text-xl font-bold">Filter Problems</h2>

        {/* <div className="space-y-2">
          <label className="font-semibold">searchKey</label>
          <Input
            value={localFilter.searchKey || ""}
            onChange={(e) => setLocalFilter({ ...localFilter, searchKey: e.target.value })}
          />

          <label className="font-semibold">Level</label>
          <Select
            value={localFilter.pro || ""}
            onValueChange={(value: string) =>
              setLocalFilter({ ...localFilter, level: value as "easy" | "medium" | "hard" })
            }
          >
            <option value="">Select level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>

          <label className="font-semibold">Status</label>
          <Select
            value={localFilter.status || ""}
            onValueChange={(value: string) => setLocalFilter({ ...localFilter, isCom: value as "done" | "not done" })}
          >
            <option value="">Select status</option>
            <option value="done">Done</option>
            <option value="not done">Not Done</option>
          </Select>

          <label className="font-semibold">Categories</label>
          <MultiSelect
            value={localFilter.categories || []}
            onChange={(categories: ProblemCategoryType[]) => setLocalFilter({ ...localFilter, categories })}
            options={[
              { label: "Array", value: "array" },
              { label: "Graph", value: "graph" },
              { label: "DP", value: "dp" }
              // Extend this list as needed
            ]}
            placeholder="Select categories"
          />
        </div> */}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onFilter(currentFilter)}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

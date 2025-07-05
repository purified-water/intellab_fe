import { useState } from "react";
import { Button, Spinner } from "@/components/ui";
import { TCategory } from "@/types";
import { AdminProblemParams } from "../types/ProblemListType";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn";

type Props = {
  isVisible: boolean;
  currentFilter: AdminProblemParams;
  onApplyFilter: (filter: AdminProblemParams) => void;
  isLoadingCategories?: boolean;
  categories: TCategory[];
};

const publicationOptions = [
  { label: "All", value: undefined },
  { label: "Public", value: true },
  { label: "Private", value: false }
];

const levelOptions = [
  { label: "All", value: null },
  { label: "Easy", value: "easy" as const },
  { label: "Medium", value: "medium" as const },
  { label: "Hard", value: "hard" as const }
];

export function AdminProblemFilterDialog({
  isVisible,
  currentFilter,
  onApplyFilter,
  categories,
  isLoadingCategories
}: Props) {
  const [localFilter, setLocalFilter] = useState<AdminProblemParams>(currentFilter);

  const handleCategoryClick = (category: TCategory) => {
    const exists = localFilter.categories?.some((c) => c === category.categoryId);
    const newCategories = exists
      ? localFilter.categories?.filter((c) => c !== category.categoryId)
      : [...(localFilter.categories || []), category.categoryId];
    setLocalFilter({ ...localFilter, categories: newCategories });
  };

  const handleApply = () => {
    onApplyFilter(localFilter);
  };

  const handleReset = () => {
    const resetFilter = { ...currentFilter, level: null, isPublished: undefined, categories: [] };
    onApplyFilter(resetFilter);
    setLocalFilter(resetFilter);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isVisible ? "auto" : 0, opacity: isVisible ? 1 : 0 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ overflow: "hidden" }}
      className="inline-block py-2 px-9"
    >
      <div
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" // Adjust the values for position and blur
        }}
        className="w-[1100px] px-6 py-4 mx-auto text-black rounded-lg"
      >
        <div className="flex items-baseline justify-start gap-12 mb-4">
          {/* Levels */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Level</h3>
            <RadioGroup
              value={localFilter.level ?? "all"}
              onValueChange={(value) =>
                setLocalFilter({
                  ...localFilter,
                  level: value === "all" ? null : (value as AdminProblemParams["level"])
                })
              }
              className="space-y-2"
            >
              {levelOptions.map((option) => (
                <div key={String(option.value)} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={option.value === null ? "all" : option.value}
                    id={`level-${option.value === null ? "all" : option.value}`}
                  />
                  <label
                    htmlFor={`level-${option.value === null ? "all" : option.value}`}
                    className="capitalize cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Free</h3>
            <RadioGroup
              value={String(localFilter.isPublished)}
              onValueChange={(value) =>
                setLocalFilter({
                  ...localFilter,
                  isPublished: value === "undefined" ? undefined : value === "true" ? true : false
                })
              }
              className="space-y-2"
            >
              {publicationOptions.map((option) => (
                <div key={String(option.value)} className="flex items-center gap-2">
                  <RadioGroupItem value={String(option.value)} id={`status-${String(option.value)}`} />
                  <label htmlFor={`status-${String(option.value)}`} className="cursor-pointer">
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <>
          <h3 className="mb-2 text-lg font-semibold">Categories</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {isLoadingCategories ? (
              <Spinner loading />
            ) : categories.length === 0 ? (
              <div className="text-gray-500">No categories available</div>
            ) : null}
            {!isLoadingCategories &&
              categories.map((category) => {
                const isSelected = localFilter.categories?.some((c) => c === category.categoryId);
                return (
                  <button
                    type="button"
                    key={category.categoryId}
                    className={`px-3 py-1 rounded-md border border-gray-300 transition-colors duration-150 ${
                      isSelected ? "bg-appPrimary text-white" : "bg-white"
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.name}
                  </button>
                );
              })}
          </div>
        </>

        <div className="flex justify-end gap-4 mt-6 font-semibold">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </motion.div>
  );
}

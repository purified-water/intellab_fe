import { useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/shadcn";
import { TCategory } from "@/types";

interface CourseCategoriesSelectProps {
  value: TCategory[];
  onChange: (value: TCategory[]) => void;
  disabled?: boolean;
}

export const CourseCategoriesSelect = ({ value, onChange, disabled = false }: CourseCategoriesSelectProps) => {
  const [categories] = useState<TCategory[]>([
    { categoryId: 1, name: "category 1" },
    { categoryId: 2, name: "category 2" },
    { categoryId: 3, name: "category 3" },
    { categoryId: 4, name: "category 04" },
    { categoryId: 5, name: "category 5" },
    { categoryId: 6, name: "category 6" },
    { categoryId: 7, name: "category 7" },
    { categoryId: 8, name: "category 08" },
    { categoryId: 9, name: "category 009" },
    { categoryId: 10, name: "category 10" },
    { categoryId: 11, name: "category 011" },
    { categoryId: 12, name: "category 12" },
    { categoryId: 13, name: "category 13" }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryList, setShowCategoryList] = useState(false);

  const handleAddCategory = (category: TCategory) => {
    if (!value.some((c) => c.categoryId === category.categoryId)) {
      onChange([...value, category]);
    }
  };

  const handleRemoveCategory = (categoryId: number) => {
    onChange(value.filter((c) => c.categoryId !== categoryId));
  };

  const toggleCategoryList = () => {
    setShowCategoryList(!showCategoryList);
    setSearchTerm("");
  };

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const availableCategories = filteredCategories.filter((c) => !value.some((v) => v.categoryId === c.categoryId));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((category, index) => (
          <div key={index} className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-lg">
            {category.name}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveCategory(category.categoryId)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {!disabled && (
          <button
            type="button"
            onClick={toggleCategoryList}
            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      {showCategoryList && (
        <div className="p-4 border rounded-md">
          <div className="relative mb-4">
            <Search className="absolute transform -translate-y-1/2 text-gray3 left-3 top-1/2" size={16} />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {availableCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddCategory(category)}
                  className="px-4 py-1 text-sm bg-white border rounded-lg hover:bg-gray6/50"
                >
                  {category.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray3">
              {searchTerm ? "No matching categories found" : "No more categories available"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

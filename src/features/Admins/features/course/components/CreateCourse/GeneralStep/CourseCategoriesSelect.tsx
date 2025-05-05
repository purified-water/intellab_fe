import { useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/shadcn";

type Category = {
  id: string;
  name: string;
};

interface CourseCategoriesSelectProps {
  value: Category[];
  onChange: (value: Category[]) => void;
}

export const CourseCategoriesSelect = ({ value, onChange }: CourseCategoriesSelectProps) => {
  const [categories] = useState<Category[]>([
    { id: "1", name: "category 1" },
    { id: "2", name: "category 2" },
    { id: "3", name: "category 3" },
    { id: "4", name: "category 04" },
    { id: "5", name: "category 5" },
    { id: "6", name: "category 6" },
    { id: "7", name: "category 7" },
    { id: "8", name: "category 08" },
    { id: "9", name: "category 009" },
    { id: "10", name: "category 10" },
    { id: "11", name: "category 011" },
    { id: "12", name: "category 12" },
    { id: "13", name: "category 13" }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategoryList, setShowCategoryList] = useState(false);

  const handleAddCategory = (category: Category) => {
    if (!value.some((c) => c.id === category.id)) {
      onChange([...value, category]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(value.filter((c) => c.id !== categoryId));
  };

  const toggleCategoryList = () => {
    setShowCategoryList(!showCategoryList);
    setSearchTerm("");
  };

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const availableCategories = filteredCategories.filter((c) => !value.some((v) => v.id === c.id));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((category) => (
          <div key={category.id} className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-lg">
            {category.name}
            <button
              type="button"
              onClick={() => handleRemoveCategory(category.id)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={toggleCategoryList}
          className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Plus size={16} /> Add
        </button>
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
              {availableCategories.map((category) => (
                <button
                  key={category.id}
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

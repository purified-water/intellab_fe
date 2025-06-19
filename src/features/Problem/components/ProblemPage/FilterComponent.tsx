import { courseAPI } from "@/lib/api/courseApi";
import { TCategory } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { fetchPaginatedProblems, filterProblems, resetFilters } from "@/redux/problem/problemSlice";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn";

export const FilterComponent: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>("All");
  const [selectedStatus, setSelectedStatus] = useState<string | null>("All");

  const [categories, setCategories] = useState<TCategory[]>([]);
  const dispatch = useAppDispatch();
  const levels = ["All", "Easy", "Medium", "Hard"];
  const status = ["All", "Solved", "Not Solved"];

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await courseAPI.getCategories();
        if (response?.result) {
          setCategories(response.result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (topic: TCategory) => {
    setSelectedCategories((prev) => {
      const newGenres = prev.includes(topic) ? prev.filter((g) => g !== topic) : [...prev, topic];

      return newGenres;
    });
  };

  const handleFilter = async () => {
    let myStatus = null;
    if (selectedStatus === "All" || selectedStatus === null) {
      myStatus = null;
    } else if (selectedStatus === "Solved") {
      myStatus = true;
    } else {
      myStatus = false;
    }
    let myLevel = selectedLevel;
    if (selectedLevel === "All" || selectedLevel === null) {
      myLevel = null;
    }

    dispatch(
      fetchPaginatedProblems({
        keyword: "",
        page: 0,
        size: 20,
        selectedCategories: selectedCategories,
        level: myLevel?.toLowerCase() || null,
        status: myStatus
      })
    );
    dispatch(filterProblems());
  };

  return (
    <div
      style={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" // Adjust the values for position and blur
      }}
      className="w-[1100px] p-6 mx-auto text-black rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-appPrimary">Filter</h2>
      <div className="mt-6 space-y-4">
        <div className="flex flex-col items-baseline justify-start gap-7">
          <div className="flex gap-32">
            <div className="flex flex-col">
              <RadioGroup
                value={selectedLevel || "All"}
                onValueChange={handleLevelChange}
                className="flex flex-col space-y-1"
              >
                <h3 className="text-lg font-semibold">Levels</h3>
                {levels.map((level) => (
                  <label key={`level-${level}`} className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value={level} id={`level-${level}`} />
                    <span>{level}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="flex flex-col">
              <RadioGroup
                value={selectedStatus || "All"}
                onValueChange={handleStatusChange}
                className="flex flex-col space-y-1"
              >
                <h3 className="text-lg font-semibold">Status</h3>
                {status.map((isDone) => (
                  <label key={`status-${isDone}`} className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value={isDone} id={`status-${isDone}`} />
                    <span>{isDone}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
          {/* Category Selection */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Categories</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  className={`px-3 py-1 rounded-md border border-gray5 transition-colors duration-150 ${selectedCategories.includes(category) ? "bg-appPrimary text-white" : "bg-white"}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          className="px-6 py-3 text-white rounded-lg bg-appPrimary hover:bg-opacity-75"
          onClick={handleFilter}
        >
          Filter
        </Button>
        <Button
          variant="outline"
          className="px-6 py-3 bg-white border rounded-lg border-appPrimary text-appPrimary hover:opacity-70"
          onClick={() => {
            dispatch(resetFilters());
            setSelectedCategories([]);
            setSelectedLevel("All");
            setSelectedStatus("All");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

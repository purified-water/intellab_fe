import { courseAPI } from "@/lib/api/courseApi";
import { TCategory } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { fetchPaginatedProblems, filterProblems } from "@/redux/problem/problemSlice";
import React, { useEffect, useState } from "react";

export const FilterComponent: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>("All");
  const [selectedStatus, setSelectedStatus] = useState<string | null>("All");

  const [categories, setCategories] = useState<TCategory[]>([]);
  const dispatch = useAppDispatch();
  const levels = ["All", "Easy", "Medium", "Hard"];
  const status = ["All", "Done", "Not Done"];
  // const categories = [
  //   "Recursive",
  //   "Queue",
  //   "Data Structure",
  //   "Problem Solving",
  //   "Matrix",
  //   "Algorithm",
  //   "Array",
  //   "Dynamic Programming"
  // ];

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
      console.log("selected genres:", newGenres);
      return newGenres;
    });
  };

  const handleFilter = async () => {
    let myStatus = null;
    if (selectedStatus === "All" || selectedStatus === null) {
      myStatus = null;
    } else if (selectedStatus === "Done") {
      myStatus = true;
    } else {
      myStatus = false;
    }
    let myLevel = selectedLevel;
    if (selectedLevel === "All" || selectedLevel === null) {
      myLevel = null;
    }
    console.log("------- LEVEL AND STATUS -----", myLevel, myStatus);
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
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" // Adjust the values for position and blur
      }}
      className="w-4/5 p-6 mx-auto text-black rounded-lg shadow-lg shadow-spread-2"
    >
      <h2 className="text-2xl font-bold text-appPrimary">Filter</h2>
      <div className="mt-6 space-y-4">
        <div className="flex flex-col items-baseline justify-start gap-7">
          <div className="flex gap-32">
            <div className="flex flex-col">
              <h3 className="mb-2 text-lg font-bold">Levels</h3>
              <div className="space-y-2">
                {levels.map((level) => (
                  <label key={`level-${level}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      checked={selectedLevel === level}
                      onChange={() => handleLevelChange(level)}
                      className="hidden"
                      id={`level-${level}`}
                    />
                    <div
                      className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${
                        selectedLevel === level ? "border-appPrimary bg-appPrimary" : "bg-white"
                      }`}
                    >
                      {selectedLevel === level && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <span>{level}</span>
                    {/* Optional: <span className="text-gray-400">({rating.count})</span> */}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-2 text-lg font-bold">Status</h3>
              <div className="space-y-2">
                {status.map((isDone) => (
                  <label key={`status-${isDone}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={isDone}
                      checked={selectedStatus === isDone}
                      onChange={() => handleStatusChange(isDone)}
                      className="hidden"
                      id={`status-${isDone}`}
                    />
                    <div
                      className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${
                        selectedStatus === isDone ? "border-appPrimary bg-appPrimary" : "bg-white"
                      }`}
                    >
                      {selectedStatus === isDone && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <span>{isDone}</span>
                    {/* Optional: <span className="text-gray-400">({rating.count})</span> */}
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Category Selection */}
          <div>
            <h3 className="mb-2 text-lg font-bold">Categories</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  className={`px-3 py-1 rounded-md border border-appPrimary ${selectedCategories.includes(category) ? "bg-appPrimary text-white" : "bg-white"}`}
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
        <button className="px-6 py-3 text-white rounded-lg bg-appPrimary hover:bg-opacity-75" onClick={handleFilter}>
          Filter
        </button>
        <button
          className="px-6 py-3 bg-white border rounded-lg border-appPrimary text-appPrimary hover:opacity-70"
          onClick={() => {
            setSelectedCategories([]);
            setSelectedLevel("All");
            setSelectedStatus("All");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

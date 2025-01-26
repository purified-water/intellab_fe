import React, { useState } from "react";

export interface PriceRange {
  min: number;
  max: number;
}

const FilterComponent: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categories = [
    "Recursive",
    "Queue",
    "Data Structure",
    "Problem Solving",
    "Matrix",
    "Algorithm",
    "Array",
    "Dynamic Programming"
  ];

  const handleCategoryClick = (topic: string) => {
    setSelectedCategories((prev) => {
      const newGenres = prev.includes(topic) ? prev.filter((g) => g !== topic) : [...prev, topic];
      console.log("selected genres:", newGenres);
      return newGenres;
    });
  };

  const handleFilter = () => {
    // dispatch(filterCourses({ selectedCategories, selectedRating, selectedLevels, selectedPrices, priceRange }));
  };

  return (
    <div
      style={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" // Adjust the values for position and blur
      }}
      className="w-4/5 p-6 mx-auto text-black rounded-lg shadow-lg shadow-spread-2"
    >
      <h2 className="text-2xl font-bold text-appPrimary">Filter</h2>
      <div className="space-y-4">
        <div className="flex items-baseline justify-start gap-24">
          {/* Category Selection */}
          <div>
            <h3 className="mb-2 text-lg font-bold">Categories</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-md border border-appPrimary ${selectedCategories.includes(category) ? "bg-appPrimary text-white" : "bg-white"}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
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
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterComponent;

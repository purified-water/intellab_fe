import React, { useEffect, useState } from "react";
import { fetchExploreCourses, filterCourses, resetFilters } from "@/redux/course/courseSlice";
import { useAppDispatch } from "@/redux/hooks";
import { courseAPI } from "@/lib/api/courseApi";
import { PriceRange, TCategory } from "@/types";

interface SearchKeyword {
  keyword: string;
}
export const FilterComponent: React.FC<SearchKeyword> = ({ keyword }) => {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | null>("0");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 1, max: 1000000 });
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<TCategory[]>([]);
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

  const ratings = [
    { label: "All", value: "0", count: 0 },
    { label: "4.5 & up", value: "4.5", count: 424 },
    { label: "4.0 & up", value: "4.0", count: 588 },
    { label: "3.5 & up", value: "3.5", count: 619 },
    { label: "3.0 & up", value: "3.0", count: 626 }
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const prices = ["Free", "Paid"];

  const handlePriceChange = (price: string) => {
    setSelectedPrices((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]));
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  };

  const handleCategoryClick = (topic: TCategory) => {
    setSelectedCategories((prev) => {
      const newGenres = prev.includes(topic) ? prev.filter((g) => g !== topic) : [...prev, topic];
      console.log("selected genres:", newGenres);
      return newGenres;
    });
  };

  const handleFilter = async () => {
    await dispatch(fetchExploreCourses({ keyword, selectedCategories, selectedRating, selectedPrices }));
    dispatch(filterCourses({ selectedLevels, selectedPrices, priceRange }));
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
          {/* Ratings Section */}
          <div>
            <h3 className="mb-2 text-lg font-bold">Ratings</h3>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating.value}
                    checked={selectedRating === rating.value}
                    onChange={() => setSelectedRating(rating.value)}
                    className="hidden"
                    id={`rating-${rating.value}`}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${
                      selectedRating === rating.value ? "border-appPrimary bg-appPrimary" : "bg-white"
                    }`}
                  >
                    {selectedRating === rating.value && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                  {rating.value !== "0" && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      {"★".repeat(Math.floor(parseFloat(rating.value)))}
                      {"☆".repeat(5 - Math.floor(parseFloat(rating.value)))}
                    </div>
                  )}
                  <span>{rating.label}</span>
                  {/* Optional: <span className="text-gray-400">({rating.count})</span> */}
                </label>
              ))}
            </div>
          </div>
          {/* Levels Section */}
          <div>
            <h3 className="mb-2 text-lg font-bold">Levels</h3>
            <div className="space-y-2">
              {levels.map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={level}
                    checked={selectedLevels.includes(level)}
                    onChange={() => handleLevelChange(level)}
                    className="hidden peer"
                  />
                  <div
                    className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-purple-500 peer-checked:border-purple-500`}
                  >
                    {selectedLevels.includes(level) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="white"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prices Section */}

          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">Price</h3>
            <div className="space-y-2">
              {prices.map((price) => (
                <label key={price} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={price}
                    checked={selectedPrices.includes(price)}
                    onChange={() => handlePriceChange(price)}
                    className="hidden peer"
                  />
                  <div
                    className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-purple-500 peer-checked:border-purple-500`}
                  >
                    {selectedPrices.includes(price) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="white"
                        className="w-4 h-4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span>{price}</span>
                </label>
              ))}
            </div>
            {selectedPrices.includes("Paid") && (
              <div className="flex items-center mt-4 space-x-2">
                <span>From:</span>
                <input
                  type="number"
                  className="w-24 p-1 text-black bg-transparent border rounded-md border-appPrimary"
                  placeholder="0"
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                />
                <span>To:</span>
                <input
                  type="number"
                  className="w-24 p-1 text-black bg-transparent border rounded-md border-appPrimary"
                  placeholder="200,000"
                  onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                />
              </div>
            )}
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

      {/* Filter Button */}
      <div className="flex gap-4 mt-6">
        <button className="px-6 py-3 text-white rounded-lg bg-appPrimary hover:bg-opacity-75" onClick={handleFilter}>
          Filter
        </button>
        <button
          className="px-6 py-3 bg-white border rounded-lg border-appPrimary text-appPrimary hover:opacity-70"
          onClick={() => {
            dispatch(resetFilters());
            setSelectedCategories([]);
            setSelectedRating("0");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

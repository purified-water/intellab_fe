import React, { useEffect, useState } from "react";
import { fetchExploreCourses, resetFilters } from "@/redux/course/courseSlice";
import { useAppDispatch } from "@/redux/hooks";
import { courseAPI } from "@/lib/api/courseApi";
import { PriceRange, TCategory } from "@/types";
import { Button } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn";

interface SearchKeyword {
  keyword: string;
}
export const FilterComponent: React.FC<SearchKeyword> = ({ keyword }) => {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | null>("0");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: null, max: null });
  const [priceError, setPriceError] = useState<string>("");
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<TCategory[]>([]);

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
    { label: "All", value: "0" },
    { label: "4.5 & up", value: "4.5" },
    { label: "4.0 & up", value: "4.0" },
    { label: "3.5 & up", value: "3.5" },
    { label: "3.0 & up", value: "3.0" }
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  };

  const handleCategoryClick = (topic: TCategory) => {
    setSelectedCategories((prev) => {
      const newGenres = prev.includes(topic) ? prev.filter((g) => g !== topic) : [...prev, topic];
      return newGenres;
    });
  };

  const handleFilter = async () => {
    // Don't allow filtering if there's a price error
    if (priceError) {
      return;
    }

    const priceFrom: number | null = priceRange.min !== undefined ? priceRange.min : null;
    const priceTo = priceRange.max || null;

    // Final validation before submitting
    if (priceFrom !== null && priceTo !== null && priceFrom > priceTo) {
      setPriceError("From price must be less than or equal to To price");
      return;
    }

    await dispatch(
      fetchExploreCourses({
        keyword,
        selectedCategories,
        selectedLevels,
        selectedRating,
        priceFrom,
        priceTo
      })
    );
  };

  return (
    <div
      style={{
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" // Adjust the values for position and blur
      }}
      className="w-[1100px] p-6 mx-auto text-black rounded-lg shadow-lg shadow-spread-2"
    >
      <h2 className="text-2xl font-semibold text-appPrimary">Filter</h2>
      <div className="space-y-4">
        <div className="flex items-baseline justify-start gap-24">
          {/* Ratings Section */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Ratings</h3>
            <RadioGroup value={selectedRating || "0"} onValueChange={setSelectedRating} className="space-y-1">
              {ratings.map((rating) => (
                <label key={rating.value} className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value={rating.value} id={`rating-${rating.value}`} />
                  {rating.value !== "0" && (
                    <div className="flex items-center gap-1 text-appMedium">
                      {"★".repeat(Math.floor(parseFloat(rating.value)))}
                      {"☆".repeat(5 - Math.floor(parseFloat(rating.value)))}
                    </div>
                  )}
                  <span>{rating.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          {/* Levels Section */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Levels</h3>
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
                    className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-appPrimary peer-checked:border-purple-500`}
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

            <div className="flex flex-col">
              <div className="flex items-center mt-4 space-x-2">
                <span>From:</span>
                <input
                  type="number"
                  className={`w-24 p-1 text-black bg-transparent border rounded-md ${priceError ? "border-red-500" : "border-appPrimary"}`}
                  placeholder="0"
                  value={priceRange.min === null ? "" : priceRange.min}
                  onChange={(e) => {
                    const newMin = e.target.value === "" ? null : Number(e.target.value);
                    setPriceRange((prev) => {
                      const updatedRange = { ...prev, min: newMin };

                      // Validate price range
                      if (newMin !== null && prev.max !== null && newMin > prev.max) {
                        setPriceError("From price must be less than or equal to To price");
                      } else {
                        setPriceError("");
                      }

                      return updatedRange;
                    });
                  }}
                />
                <span>To:</span>
                <input
                  type="number"
                  className={`w-24 p-1 text-black bg-transparent border rounded-md ${priceError ? "border-red-500" : "border-appPrimary"}`}
                  placeholder="500,000"
                  value={priceRange.max === null ? "" : priceRange.max}
                  onChange={(e) => {
                    const newMax = e.target.value === "" ? null : Number(e.target.value);
                    setPriceRange((prev) => {
                      const updatedRange = { ...prev, max: newMax };

                      // Validate price range
                      if (prev.min !== null && newMax !== null && prev.min > newMax) {
                        setPriceError("From price must be less than or equal to To price");
                      } else {
                        setPriceError("");
                      }

                      return updatedRange;
                    });
                  }}
                />
              </div>
              {priceError && <div className="mt-1 text-xs text-red-500">{priceError}</div>}
            </div>
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
            setSelectedLevels([]);
            setPriceRange({ min: null, max: null });
            setSelectedCategories([]);
            setSelectedRating("0");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

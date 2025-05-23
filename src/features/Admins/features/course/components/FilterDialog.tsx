import { useEffect, useState } from "react";
import { courseAPI } from "@/lib/api/courseApi";
import { PriceRange, TCategory, TCourseFilter } from "@/types";
import { motion } from "framer-motion";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { Button } from "@/components/ui";

interface FilterDialogProps {
  isVisible: boolean;
  currentFilter: TCourseFilter | null;
  onFilter: (filters: TCourseFilter) => void;
}

export function FilterDialog(props: FilterDialogProps) {
  const { isVisible, currentFilter, onFilter } = props;

  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | null>("0");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await courseAPI.getCategories();
        if (response?.result) {
          setCategories(response.result);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          showToastError({ toast: toast.toast, message: error.message });
        }
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
    setSelectedCategories((prev) => (prev.includes(topic) ? prev.filter((g) => g !== topic) : [...prev, topic]));
  };

  useEffect(() => {
    if (!selectedPrices.includes("Paid")) {
      setPriceRange(null);
    }
  }, [selectedPrices]);

  const handleFilter = () => {
    const newFilters: TCourseFilter = {
      categories: selectedCategories,
      rating: selectedRating,
      levels: selectedLevels,
      prices: selectedPrices,
      priceRange,
      keyword: currentFilter?.keyword || "",
      isCompletedCreation: currentFilter?.isCompletedCreation || true
    };
    onFilter(newFilters);
  };

  const handleResetClick = () => {
    setSelectedCategories([]);
    setSelectedRating("0");
    setSelectedLevels([]);
    setSelectedPrices([]);
    setPriceRange(null);
    onFilter({
      categories: [],
      rating: "0",
      levels: [],
      prices: [],
      priceRange: null,
      keyword: currentFilter?.keyword || "",
      isCompletedCreation: currentFilter?.isCompletedCreation || true
    });
  };

  const renderRatings = () => (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Ratings</h3>
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
          </label>
        ))}
      </div>
    </div>
  );

  const renderLevels = () => (
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
              className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-purple-500`}
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
  );

  const renderPrices = () => (
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
            onChange={(e) =>
              setPriceRange((prev) =>
                prev ? { ...prev, min: Number(e.target.value) } : { min: Number(e.target.value), max: 0 }
              )
            }
          />
          <span>To:</span>
          <input
            type="number"
            className="w-24 p-1 text-black bg-transparent border rounded-md border-appPrimary"
            placeholder="200,000"
            onChange={(e) =>
              setPriceRange((prev) =>
                prev ? { ...prev, max: Number(e.target.value) } : { min: 0, max: Number(e.target.value) }
              )
            }
          />
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Categories</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((category) => (
          <button
            key={category.categoryId}
            className={`px-3 py-1 rounded-md border border-gray5 transition-colors duration-200 ${
              selectedCategories.includes(category) ? "bg-appPrimary text-white" : "bg-white"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderButtons = () => {
    return (
      <div className="flex gap-4 mt-6 font-semibold">
        <Button className="px-6 py-2 text-white rounded-lg bg-appPrimary hover:bg-opacity-75" onClick={handleFilter}>
          Filter
        </Button>
        <Button
          variant="outline"
          className="px-6 py-2 bg-white border rounded-lg border-appPrimary text-appPrimary hover:opacity-70"
          onClick={handleResetClick}
        >
          Reset
        </Button>
      </div>
    );
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
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
        }}
        className="w-[1000px] p-6 text-black rounded-lg shadow-lg shadow-spread-2"
      >
        <h2 className="text-2xl font-semibold text-appPrimary">Filter</h2>
        <div className="space-y-4">
          <div className="flex items-baseline justify-start gap-24">
            {renderRatings()}
            {renderLevels()}
            {renderPrices()}
          </div>
          {renderCategories()}
        </div>
        {renderButtons()}
      </div>
    </motion.div>
  );
}

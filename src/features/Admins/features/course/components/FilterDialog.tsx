import { useEffect, useState } from "react";
import { courseAPI } from "@/lib/api/courseApi";
import { TCategory, TCourseFilter } from "@/types";
import { motion } from "framer-motion";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { Button } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn";

interface FilterDialogProps {
  isVisible: boolean;
  currentFilter: TCourseFilter;
  onFilter: (filters: TCourseFilter) => void;
}

export function FilterDialog(props: FilterDialogProps) {
  const { isVisible, currentFilter, onFilter } = props;

  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [selectedRating, setSelectedRating] = useState<string | null>("0");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceFilterType, setPriceFilterType] = useState<string | null>(null);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [priceFrom, setPriceFrom] = useState<number | null>(null);
  const [priceTo, setPriceTo] = useState<number | null>(null);
  const [priceRangeError, setPriceRangeError] = useState<string | null>(null);

  const toast = useToast();

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const setPriceRange = (from: number | null, to: number | null) => {
    setPriceFrom(from);
    setPriceTo(to);
  };

  useEffect(() => {
    if (priceFilterType) {
      if (priceFilterType === "Free") {
        setPriceRange(0, 0);
      } else {
        setPriceRange(0, 200000);
      }
    } else {
      setPriceRange(null, null);
    }
  }, [priceFilterType]);

  useEffect(() => {
    if (priceFilterType === "Paid") {
      if (priceFrom === null || priceTo === null) {
        setPriceRangeError("Please enter a valid price range.");
      } else if (priceFrom > priceTo) {
        setPriceRangeError("Price From cannot be greater than Price To.");
      } else {
        setPriceRangeError(null);
      }
    }
  }, [priceFrom, priceTo]);

  const ratings = [
    { label: "All", value: "0" },
    { label: "4.5 & up", value: "4.5" },
    { label: "4.0 & up", value: "4.0" },
    { label: "3.5 & up", value: "3.5" },
    { label: "3.0 & up", value: "3.0" }
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const prices = ["Free", "Paid"];

  const handlePriceFilterTypeChange = (price: string) => {
    setPriceFilterType((prev) => (prev === price ? null : price));
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  };

  const handleCategoryClick = (topic: TCategory) => {
    setSelectedCategories((prev) => (prev.includes(topic) ? prev.filter((g) => g !== topic) : [...prev, topic]));
  };

  const handleFilter = () => {
    if (!priceRangeError) {
      const newFilters: TCourseFilter = {
        categories: selectedCategories,
        rating: selectedRating,
        levels: selectedLevels,
        price: priceFilterType,
        keyword: currentFilter.keyword,
        isCompletedCreation: currentFilter.isCompletedCreation,
        priceFrom: priceFrom,
        priceTo: priceTo
      };
      onFilter(newFilters);
    }
  };

  const handleResetClick = () => {
    setSelectedCategories([]);
    setSelectedRating("0");
    setSelectedLevels([]);
    setPriceFilterType(null);
    setPriceFrom(null);
    setPriceTo(null);
    onFilter({
      categories: [],
      rating: null,
      levels: [],
      price: null,
      keyword: currentFilter.keyword,
      isCompletedCreation: currentFilter.isCompletedCreation,
      priceFrom: null,
      priceTo: null
    });
  };

  const renderRatings = () => (
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
              className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-appPrimary`}
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
              checked={priceFilterType === price}
              onChange={() => handlePriceFilterTypeChange(price)}
              className="hidden peer"
            />
            <div
              className={`w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-appPrimary peer-checked:border-appPrimary`}
            >
              {priceFilterType === price && (
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
      {priceFilterType == "Paid" && (
        <div className="flex items-center mt-4 space-x-2">
          <span>From:</span>
          <input
            type="number"
            className="w-24 p-1 text-black bg-transparent border rounded-md border-appPrimary"
            placeholder="0"
            value={priceFrom ?? ""}
            onChange={(e) => setPriceFrom(e.target.value ? Number(e.target.value) : null)}
            required
          />
          <span>To:</span>
          <input
            type="number"
            className="w-24 p-1 text-black bg-transparent border rounded-md border-appPrimary"
            placeholder="200,000"
            value={priceTo ?? ""}
            onChange={(e) => setPriceTo(e.target.value ? Number(e.target.value) : null)}
            required
          />
        </div>
      )}
      <p className="mt-1 text-xs text-red-500">{priceRangeError}</p>
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
        <Button
          type="button"
          className="px-6 py-2 text-white rounded-lg bg-appPrimary hover:bg-opacity-75"
          onClick={handleFilter}
        >
          Filter
        </Button>
        <Button
          type="button"
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

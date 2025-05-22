import clsx from "clsx";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { ProblemCategoryType } from "@/types/ProblemType";
import { TCategory } from "@/types";
import { CourseLevels, ProblemLevels } from "@/constants/enums/appLevels";

interface LevelCardProps {
  level: string;
  categories?: ProblemCategoryType[] | TCategory[];
}

export const LevelCard = ({ level, categories }: LevelCardProps) => {
  // Get top 2 categories
  if (categories && categories.length > 2) {
    categories = categories.slice(0, 2);
  }
  if (!level) return null;

  const levelColor = clsx({
    "text-appEasy": level.toLowerCase() === ProblemLevels.EASY || level.toLowerCase() === CourseLevels.BEGINNER,
    "text-appMedium": level.toLowerCase() === ProblemLevels.MEDIUM || level.toLowerCase() === CourseLevels.INTERMEDIATE,
    "text-appHard": level.toLowerCase() === ProblemLevels.HARD || level.toLowerCase() === CourseLevels.ADVANCED
  });

  return (
    <div className="flex items-center my-4 space-x-3 text-xs font-medium">
      <span className={clsx("rounded-lg bg-gray6/70 px-3 py-1", levelColor)}>{capitalizeFirstLetter(level)}</span>
      <div className="flex max-w-xs gap-2 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-gray-300">
        {categories?.map((cat) => (
          <div
            key={cat.categoryId}
            className="px-3 py-1 rounded-lg max-w-[120px] truncate text-gray1 bg-gray6/70 whitespace-nowrap"
            title={capitalizeFirstLetter(cat.name)}
          >
            {capitalizeFirstLetter(cat.name)}
          </div>
        ))}
      </div>
    </div>
  );
};

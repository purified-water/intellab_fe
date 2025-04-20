import clsx from "clsx";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { ProblemLevels } from "../../constants/ProblemLevels";
import { ProblemCategoryType } from "@/types/ProblemType";

interface LevelCardProps {
  level: string;
  categories?: ProblemCategoryType[];
}

export const LevelCard = ({ level, categories }: LevelCardProps) => {
  if (!level) return null;

  const levelColor = clsx({
    "text-appEasy": level.toLowerCase() === ProblemLevels.EASY,
    "text-appMedium": level.toLowerCase() === ProblemLevels.MEDIUM,
    "text-appHard": level.toLowerCase() === ProblemLevels.HARD
  });

  return (
    <div className="flex items-center my-4 space-x-3 text-xs font-medium">
      <span className={clsx("rounded-lg bg-gray6 px-3 py-1", levelColor)}>{capitalizeFirstLetter(level)}</span>
      <div className="flex flex-wrap gap-2">
        {categories?.map((cat) => (
          <div key={cat.categoryId} className="px-3 py-1 rounded-lg text-gray1 bg-gray6">
            {capitalizeFirstLetter(cat.name)}
          </div>
        ))}
      </div>
    </div>
  );
};

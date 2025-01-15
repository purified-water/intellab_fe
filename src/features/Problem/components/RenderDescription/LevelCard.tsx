import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { ProblemLevels } from "../../constants/ProblemLevels";

interface LevelCardProps {
  level: string;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  if (!level) return null;
  
  const getColor = () => {
    switch (level.toLowerCase()) {
      case ProblemLevels.EASY:
        return 'text-appEasy';
      case ProblemLevels.MEDIUM:
        return 'text-appMedium';
      case ProblemLevels.HARD:
        return 'text-appHard';
      default:
        return 'text-black';
    }
  };

  return (
    <div className="flex items-center justify-center px-3 py-1 mt-2 font-medium bg-gray6 rounded-xl w-fit">
      <span className={getColor()}>{capitalizeFirstLetter(level)}</span>
    </div>
  );
};

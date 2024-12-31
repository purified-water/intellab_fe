import { Separator } from "@/components/ui/Separator";

export const ProgressCircle = () => {
  // NOTE: Fetch user's progress
  const totalQuestions = 100;
  const easySolved = 10;
  const mediumSolved = 10;
  const hardSolved = 5;

  const easyMax = 50;
  const mediumMax = 30;
  const hardMax = 20;

  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalPercentage = Math.round((totalSolved / totalQuestions) * 100);

  const radius = 45; // 45% of the viewbox
  const strokeCircumference = 2 * Math.PI * radius;
  const strokeDashOffset = strokeCircumference - (strokeCircumference * totalPercentage) / 100;

  return (
    <div className="flex flex-col p-4 overflow-x-auto border border-gray5 rounded-md">
      <div className="text-xl font-bold text-appPrimary">Your Progress</div>

      <Separator className="mt-2 mb-5" />

      <div id="progress" className="flex flex-col items-center gap-4 md:flex-row md:justify-around">
        <div className="relative w-20 h-20 min-w-fit">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100" // Ensure a consistent viewBox
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              fill="transparent"
              className="text-gray5"
              stroke="currentColor"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="10"
              fill="transparent"
              className="text-appPrimary"
              stroke="currentColor"
              strokeDasharray={strokeCircumference}
              strokeDashoffset={strokeDashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm font-semibold text-gray3 md:text-xl">{totalPercentage}%</div>
          </div>
        </div>

        <div className="w-full space-y-2 text-left md:w-32">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Solved:</span>
            <span>
              {totalSolved}/{totalQuestions}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-appEasy">Easy:</span>
            <span>
              {easySolved}/{easyMax}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-appMedium">Medium:</span>
            <span>
              {mediumSolved}/{mediumMax}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-appHard">Hard:</span>
            <span>
              {hardSolved}/{hardMax}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

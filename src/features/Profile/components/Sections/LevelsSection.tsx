import { Progress } from "@/types";

export type LevelsSectionProps = {
  progress: Progress;
};

export const LevelsSection = (props: LevelsSectionProps) => {
  const { progress } = props;

  const { easySolved, mediumSolved, hardSolved } = progress;

  const levels = [
    { level: "Hard", solved: `${hardSolved} Problems Solved` },
    { level: "Medium", solved: `${mediumSolved} Problems Solved` },
    { level: "Easy", solved: `${easySolved} Problems Solved` }
  ];

  return (
    <div className="flex flex-col min-w-full">
      <div className="text-2xl font-semibold text-black1">Levels</div>
      {levels.map((item, index) => (
        <div key={index} className="flex items-center justify-between pt-4">
          <div className="text-lg font-normal text-black1">{item.level}</div>
          <div className="text-lg font-normal text-black1">{item.solved}</div>
        </div>
      ))}
    </div>
  );
};

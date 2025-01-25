import { Progress } from "@/types";

export type LevelsSectionProps = {
  progress: Progress;
};

export const LevelsSection = (props: LevelsSectionProps) => {
  const { progress } = props;

  const { easy, medium, hard } = progress;

  const levels = [
    { level: "Hard", solved: `${hard.solved} Problems Solved` },
    { level: "Medium", solved: `${medium.solved} Problems Solved` },
    { level: "Easy", solved: `${easy.solved} Problems Solved` }
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

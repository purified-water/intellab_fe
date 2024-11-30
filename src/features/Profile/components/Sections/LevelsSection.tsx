export const LevelsSection = () => {
  const levels = [
    { level: "Hard", solved: "1 Problem Solved" },
    { level: "Medium", solved: "15 Problems Solved" },
    { level: "Easy", solved: "15 Problems Solved" }
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

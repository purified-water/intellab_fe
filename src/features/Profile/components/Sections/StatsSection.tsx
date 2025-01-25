import { Progress } from "@/types";

type StatsSectionProps = {
  progress: Progress;
};

export const StatsSection = (props: StatsSectionProps) => {
  const { progress } = props;

  const { easy, medium, hard } = progress;

  const stats = [
    { label: "Problems Solved", value: easy.solved + medium.solved + hard.solved },
    { label: "Completed Courses", value: "15" },
    { label: "Login Streak", value: "15 days" }
  ];

  return (
    <div className="flex flex-col min-w-full">
      <div className="text-2xl font-semibold text-black1">My Stats</div>
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between pt-4">
          <div className="text-lg font-normal text-black1">{stat.label}</div>
          <div className="text-lg font-normal text-black1">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

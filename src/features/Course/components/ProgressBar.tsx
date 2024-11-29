import React from "react";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { progress } = props;

  return (
    <div className="relative h-4 bg-gray-200 rounded-md">
      <div
        className="h-full duration-300 bg-green-500 rounded-md transition-width ease"
        style={{ width: `${progress}%` }}
      />
      <span className="mt-2 text-sm font-bold text-green-500">{progress}% completed</span>
    </div>
  );
};

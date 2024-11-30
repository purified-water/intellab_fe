import React from "react";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { progress } = props;

  return (
    <div className="h-3 bg-gray-200 rounded-md max-w-xl">
      <div
        className="h-full bg-green-500 rounded-md"
        style={{ width: `${progress}%` }}
      />
      <span className="mt-2 text-sm">{progress}% completed</span>
    </div>
  );
};

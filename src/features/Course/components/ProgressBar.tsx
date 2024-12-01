interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { progress } = props;

  return (
    <div className="h-3 max-w-xl bg-white rounded-md">
      <div className="h-full rounded-md bg-appEasy" style={{ width: `${progress}%` }} />
      <span className="mt-2 text-sm">{progress}% completed</span>
    </div>
  );
};

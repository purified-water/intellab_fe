interface ProgressBarProps {
  progress: number;
  showText?: boolean;
  height?: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
  const { 
    progress, 
    showText = true,
    height = 10,
  } = props;

  return (
    <div className="max-w-4xl bg-white rounded-md" style={{height: height}}>
      <div className="h-full rounded-md bg-appEasy" style={{ width: `${progress}%` }} />
      {showText && <span className="mt-2 text-sm">
        {progress}% completed
        {progress == 100 && ". Congrats "}
      </span>}
    </div>
  );
};

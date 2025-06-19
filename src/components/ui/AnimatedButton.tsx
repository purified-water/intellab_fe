import { HiOutlineSparkles } from 'rocketicons/hi2';

interface AnimatedButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function AnimatedButton(props: AnimatedButtonProps) {
  const { label, onClick, className, disabled = false } = props;

  return (
    <button 
      type="button" 
      className={`relative px-24 py-4 overflow-hidden rounded-lg ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="absolute inset-px z-10 flex items-center justify-center gap-x-1 rounded-md bg-white text-black font-semibold m-0.5">
      <HiOutlineSparkles className="w-6 h-6 icon-black" />
      {label}
      </div>
      <span aria-hidden className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-[#E1D0FA] before:to-appAccent" />
    </button>
  );
}

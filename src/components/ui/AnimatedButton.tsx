

interface AnimatedButtonProps {
  label: string;
  onClick: () => void;
}

export default function AnimatedButton(props: AnimatedButtonProps) {
  const { label, onClick } = props;

  return (
    <button className="relative overflow-hidden rounded-lg px-24 py-4" onClick={onClick}>
      <span className="absolute inset-px z-10 flex items-center justify-center rounded-md bg-white text-black font-bold text-xl m-0.5">{label}</span>
      <span aria-hidden className="absolute inset-0 z-0 scale-x-[2.0] blur before:absolute before:inset-0 before:top-1/2 before:aspect-square before:animate-disco before:bg-gradient-conic before:from-[#E1D0FA] before:to-appAccent" />
    </button>
  )
}

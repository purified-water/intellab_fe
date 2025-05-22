interface EmptyListProps {
  message: string,
  size?: "sm" | "md" | "lg",
  className?: string
}
export const EmptyList = ({ message, size = "md", className }: EmptyListProps) => {
  const sizeClass = size === "sm" ? "size-16" : size === "md" ? "size-24" : "size-32";
  return (
    <div className={`flex flex-col items-center justify-center w-full py-8 ${className}`}>
      <img src="/assets/empty.svg" alt="Empty list" className={sizeClass} />
      <p className="text-base text-muted-foreground">{message}</p>
    </div>
  )
}

interface EmptyListProps {
  message: string,
  className?: string
}
export const EmptyMessage = ({ message, className }: EmptyListProps) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full py-8 ${className}`}>
      <p className="text-base text-center text-muted-foreground">{message}</p>
    </div>
  )
}

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-appPrimary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

type SpinnerProps = {
  loading: boolean;
  overlay?: boolean;
  size?: VariantProps<typeof loaderVariants>["size"];
  className?: string;
};

export function Spinner({ loading, overlay = false, size, className }: SpinnerProps) {
  if (!loading) return null;

  const spinner = (
    <span className={spinnerVariants({ show: loading })}>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
    </span>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center justify-center rounded-full bg-gray6 size-[4rem]">
          {spinner}
        </div>
      </div>
    );
  }

  return <div className="flex flex-col items-center justify-center">{spinner}</div>;
}

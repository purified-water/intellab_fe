import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface CategoryProps {
  loading: boolean;
  category: string;
}

export const Category = (props: CategoryProps) => {
  const { loading, category } = props;

  let content;
  if (loading) {
    content = <Skeleton className="px-3 py-1 w-32 h-8 rounded-md border shrink-0" />;
  } else {
    content = <div className="px-3 py-1 rounded-md border border-appPrimary shrink-0">{category}</div>;
  }

  return content;
};

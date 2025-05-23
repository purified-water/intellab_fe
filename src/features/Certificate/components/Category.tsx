import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface CategoryProps {
  loading: boolean;
  category: string;
}

export const Category = (props: CategoryProps) => {
  const { loading, category } = props;

  let content;
  if (loading) {
    content = <Skeleton className="w-32 h-8 px-3 py-1 mt-2 mr-2 border rounded-md shrink-0" />;
  } else {
    content = <div className="px-3 py-1 mt-2 mr-2 text-base border rounded-md border-gray5 shrink-0">{category}</div>;
  }

  return content;
};

import { Skeleton } from "@/components/ui/shadcn/skeleton.tsx";
import { ICertificate } from "@/features/Certificate/types";
import { Category } from "@/features/Certificate/components/Category.tsx";

interface LearnedSectionProps {
  loading: boolean;
  certificate: ICertificate | null;
}

export function LearnedSection(props: LearnedSectionProps) {
  const { loading, certificate } = props;

  let content = null;
  if (loading) {
    // show skeleton similar to the real content
    content = (
      <div className="border border-gray4 py-4 px-8 rounded-lg space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <section className="flex space-x-4 overflow-auto">
          {[...Array(3)].map((_, index) => (
            <Category key={index} loading={true} category={""} />
          ))}
        </section>
      </div>
    );
  } else {
    const categories = certificate?.course.categories;
    if (categories && categories.length > 0) {
      content = (<div className="border border-gray4 py-4 px-8 rounded-lg space-y-4">
        <p className="font-bold text-2xl">What you have learned</p>
        <section className="flex space-x-4 overflow-auto">
          {certificate?.course.categories.map((category, index) => (
            <Category key={index} category={category.category_name} loading={loading} />
          ))}
        </section>
      </div>)
    }
  }

  return content;
}

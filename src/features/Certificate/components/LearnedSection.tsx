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
    content = (
      <div className="border border-gray4 py-4 px-8 rounded-lg space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <section className="flex flex-wrap space-x-4">
          {[...Array(3)].map((_, index) => (
            <Category key={index} loading={true} category={""} />
          ))}
        </section>
      </div>
    );
  } else {
    const categories = certificate?.course.categories;
    if (categories && categories.length > 0) {
      content = (
        <div className="border border-gray4 py-4 px-8 rounded-lg space-y-3">
          <p className="font-bold text-2xl">What you will learn</p>
          <div className="flex flex-wrap">
            {categories.map((category, index) => (
              <Category key={index} category={category.category_name} loading={loading} />
            ))}
          </div>
        </div>
      );
    }
  }

  return content;
}

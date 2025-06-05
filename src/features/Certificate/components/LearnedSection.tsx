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
      <div className="px-8 py-4 space-y-4 border rounded-lg border-gray4">
        <Skeleton className="w-1/3 h-8" />
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
        <div className="px-6 py-4 space-y-2 border rounded-lg border-gray4">
          <p className="text-xl font-semibold">What you will learn</p>
          <div className="flex flex-wrap">
            {categories.map((category, index) => (
              <Category key={index} category={category.name} loading={loading} />
            ))}
          </div>
        </div>
      );
    }
  }

  return content;
}

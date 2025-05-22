import { HeroSection } from "./HeroSection";
import { FeatureSection } from "./FeatureSection";
import { FeaturedCoursesSection } from "./FeaturedCoursesSection";
import { PricingSection } from "./PricingSection";
import { useGetFeaturedCourses } from "@/features/StudentOverall/hooks/useHomePage";

export default function GuestHomePage() {
  const { data: featuredCourses, isPending: isFetchingFeaturedCourses } = useGetFeaturedCourses();
  const freeCourses = featuredCourses?.filter((course) => course.price === 0) || []; // Temporary filter for free courses

  return (
    <main className="flex-1">
      <HeroSection />
      <FeatureSection />
      <FeaturedCoursesSection
        featuredCourses={featuredCourses || []}
        isFetchingFeatured={isFetchingFeaturedCourses}
        freeCourses={freeCourses || []}
        isFetchingFree={false}
      />
      <PricingSection />
    </main>
  );
}

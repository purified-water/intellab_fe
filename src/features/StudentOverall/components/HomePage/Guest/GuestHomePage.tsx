import { HeroSection } from "./HeroSection";
import { FeatureSection } from "./FeatureSection";
import { FeaturedCoursesSection } from "./FeaturedCoursesSection";
import { PricingSection } from "./PricingSection";
import { useGetFeaturedCourses, useGetFreeCourses } from "@/features/StudentOverall/hooks/useHomePage";

export default function GuestHomePage() {
  const { data: featuredCourses, isPending: isFetchingFeaturedCourses } = useGetFeaturedCourses();
  const { data: freeCourses, isPending: isFetchingFreeCourses } = useGetFreeCourses();

  return (
    <main className="flex-1">
      <HeroSection />
      <FeatureSection />
      <FeaturedCoursesSection
        featuredCourses={featuredCourses || []}
        isFetchingFeatured={isFetchingFeaturedCourses}
        freeCourses={freeCourses || []}
        isFetchingFree={isFetchingFreeCourses}
      />
      <PricingSection />
    </main>
  );
}

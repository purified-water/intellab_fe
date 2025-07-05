import { LevelCard } from "@/components/LevelCard";
import { Card, CardContent, CardFooter } from "@/components/ui/shadcn";
import { PREMIUM_PACKAGES } from "@/constants";
import { RootState } from "@/redux/rootReducer";
import { ICourse } from "@/types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { rateIcon } from "@/assets";
interface GuestCourseCardProps {
  course: ICourse;
}

export const FeaturedCourseCard = ({ course }: GuestCourseCardProps) => {
  const navigate = useNavigate();
  const reduxPremiumStatus = useSelector((state: RootState) => state.premiumStatus.premiumStatus);
  const includedInPremiumPlan =
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.COURSE ||
    reduxPremiumStatus?.planType == PREMIUM_PACKAGES.RESPONSE.PREMIUM;

  let displayPrice = `${course?.price !== null && course?.price.toLocaleString()} VND`;
  if (course?.price === 0 || includedInPremiumPlan) {
    displayPrice = "Free";
  }

  return (
    <Card
      className="flex min-w-[300px] w-[370px] max-w-[370px] min-h-[380px] max-h-[380px] flex-col overflow-hidden cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg"
      onClick={() => navigate(`/course/${course.courseId}`)}
    >
      <div className="relative h-44">
        <img
          src={
            course.courseImage
              ? `${course.courseImage}?timestamp=${new Date().getTime()}`
              : "/src/assets/unavailable_image.jpg"
          }
          alt={course.courseName}
          className="object-cover w-full h-full border-b"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/src/assets/unavailable_image.jpg")}
        />
        <div className="absolute top-2 right-2">
          <div className="flex items-center justify-end px-2 pt-2 mb-5 text-sm text-white">
            <div className="flex items-center px-2 justify-center bg-black/60 rounded-lg max-w-[120px] h-[25px] ml-2">
              <img className="w-3 h-3 mr-[6px]" src={rateIcon} alt="Rating" />
              <div className="text-white">
                {course.averageRating != 0 && course.averageRating ? course.averageRating : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="flex-grow px-4 pt-2 pb-0">
        <h3 className="text-lg font-bold line-clamp-2">{course.courseName}</h3>
        <p
          className={`mt-2 text-sm text-muted-foreground ${
            course.courseName && course.courseName.length > 40 ? "line-clamp-1" : "line-clamp-2"
          }`}
        >
          {course.description}
        </p>
        <LevelCard level={course.level} categories={course.categories} />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="text-lg font-bold">{displayPrice}</div>
      </CardFooter>
    </Card>
  );
};

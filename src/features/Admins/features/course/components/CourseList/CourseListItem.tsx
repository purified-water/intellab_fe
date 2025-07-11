import { ICourse } from "@/types";
import { MoreHorizontal, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Button } from "@/components/ui";
import { Skeleton, Switch } from "@/components/ui/shadcn";
import { showToastError, shortenDate, showToastDefault } from "@/utils";
import { useToast } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { NA_VALUE } from "@/constants";
import { imageURLToFile } from "@/utils";
import { CREATE_COURSE_STEP_NUMBERS, steps } from "../../constants";
import { adminCourseAPI } from "@/features/Admins/api";

const DROP_DOWN_MENU_ITEMS = {
  VIEW: "View",
  EDIT: "Edit",
  CONTINUE_EDIT: "Continue Edit",
  DELETE: "Delete"
};

interface CourseListItemProps {
  course: ICourse;
  loading: boolean;
  onToggleCourseAvailability: (courseId: string, isAvailable: boolean) => void;
  onDeleteCourse: (course: ICourse) => void;
}

export function CourseListItem(props: CourseListItemProps) {
  const { course, loading, onToggleCourseAvailability, onDeleteCourse } = props;
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateCourseAvailabilityAPI = async () => {
    await adminCourseAPI.updateCourseAvailability({
      query: { courseId: course.courseId, isAvailable: !course.isAvailable },
      onStart: async () => {},
      onSuccess: async (response) => onToggleCourseAvailability(course.courseId, response.isAvailable),
      onFail: async (error) =>
        showToastError({ toast: toast.toast, title: "Error while updating course availability", message: error })
    });
  };

  const handleViewDetails = () => {
    console.log("--> View Details clicked for item:", course);
  };

  const handleEdit = async () => {
    showToastDefault({ toast: toast.toast, title: "Loading", message: "Fetching the course data..." });
    let thumbnailFile = null;
    if (course.courseImage) {
      thumbnailFile = await imageURLToFile(course.courseImage, course.courseName);
    }
    dispatch(
      setCreateCourse({
        courseId: course.courseId,
        courseName: course.courseName,
        courseDescription: course.description,
        courseCategories: course.categories,
        courseLevel: course.level,
        courseThumbnail: thumbnailFile,
        courseCertificate: course.templateCode || undefined,
        coursePrice: course.price ?? 0,
        courseSummary: course.aiSummaryContent || undefined,
        courseMakeAvailable: course.isAvailable,
        currentCreationStep: course.currentCreationStep,
        courseThumbnailUrl: course.courseImage,
        courseLessons: []
      })
    );
    if (course.currentCreationStep === CREATE_COURSE_STEP_NUMBERS.PREVIEW) {
      navigate("/admin/courses/create/general?editCourse=true");
    } else {
      navigate(`/admin/courses/create/${steps[course.currentCreationStep - 1].path}?editCourse=true`);
    }
  };

  const handleDeleteCourse = () => {
    onDeleteCourse(course);
  };

  const renderDropdownMenu = () => {
    const handleDropdownMenuItemClick = async (action: string) => {
      switch (action) {
        case DROP_DOWN_MENU_ITEMS.VIEW:
          handleViewDetails();
          break;
        case DROP_DOWN_MENU_ITEMS.EDIT:
        case DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT:
          handleEdit();
          break;
        case DROP_DOWN_MENU_ITEMS.DELETE:
          handleDeleteCourse();
          break;
        default:
          break;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-24 min-w-[130px] shadow-lg">
          {[
            course.isCompletedCreation ? DROP_DOWN_MENU_ITEMS.EDIT : DROP_DOWN_MENU_ITEMS.CONTINUE_EDIT,
            DROP_DOWN_MENU_ITEMS.DELETE
          ].map((action) => (
            <DropdownMenuItem
              key={action}
              onClick={() => handleDropdownMenuItemClick(action)}
              className={`text-sm py-1.5 px-3 cursor-pointer  focus:bg-gray6 ${action === DROP_DOWN_MENU_ITEMS.DELETE ? "text-appHard" : ""}`}
            >
              {action}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderLoading = () => {
    return (
      <tr className="text-base border-b border-gray5">
        <td className="py-1 max-w-[100px] truncate">
          <Skeleton className="w-full h-4" />
        </td>
        <td className="py-1">
          <Skeleton className="w-3/4 h-4" />
        </td>
        <td className="py-1">
          <Skeleton className="w-1/2 h-4" />
        </td>
        <td className="py-1 text-center">
          <div className="flex justify-center">
            <Skeleton className="w-10 h-4" />
          </div>
        </td>
        <td className="py-1">
          <div className="flex justify-center">
            <Skeleton className="w-10 h-4" />
          </div>
        </td>
        <td className="py-1 text-center">
          <Skeleton className="w-1/4 h-4 mx-auto" />
        </td>
      </tr>
    );
  };

  const renderContent = () => {
    let disPlayPrice = null;
    if (course.price == null) {
      disPlayPrice = NA_VALUE;
    } else if (course.price === 0) {
      disPlayPrice = "Free";
    } else {
      disPlayPrice = `${course.price.toLocaleString()} ${course.unitPrice}`;
    }

    return (
      <>
        <tr key={course.courseId} className="text-base border-b border-gray5">
          <td className="py-1 truncate max-w-[320px] w-[300px]">{course.courseName}</td>
          <td
            className={`py-1 font-medium ${
              course.level === "Beginner"
                ? "text-appEasy"
                : course.level === "Intermediate"
                  ? "text-appMedium"
                  : "text-appHard"
            }`}
          >
            {course.level}
          </td>
          <td className="py-1 w-[150px]">{disPlayPrice}</td>
          {course.isCompletedCreation && (
            <td className="py-1">
              <div className="flex justify-center">
                <Switch
                  checked={course.isAvailable}
                  onCheckedChange={updateCourseAvailabilityAPI}
                  className="data-[state=checked]:bg-appPrimary data-[state=unchecked]:bg-gray5"
                />
              </div>
            </td>
          )}
          {course.isCompletedCreation && (
            <td className="py-1 pr-4 text-right">{course.numberOfEnrolledStudents ?? 0}</td>
          )}
          {course.isCompletedCreation && (
            <td className="flex items-center justify-center py-1">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <span>{course.averageRating && course.averageRating > 0 ? course.averageRating.toFixed(1) : 0}</span>
                  <Star className="w-4 h-4 fill-appMedium text-appMedium" />
                </div>
                <span className="text-sm font-light text-gray3">({course.reviewCount ?? 0} reviews)</span>
              </div>
            </td>
          )}
          {!course.isCompletedCreation && (
            <td className="py-1 text-center">{shortenDate(course.createdAt) ?? NA_VALUE}</td>
          )}
          {!course.isCompletedCreation && <td className="py-1 text-center">{course.currentCreationStepDescription}</td>}
          <td className="px-5 py-1">{renderDropdownMenu()}</td>
        </tr>
      </>
    );
  };

  return loading ? renderLoading() : renderContent();
}

import { AlertDialog, Button } from "@/components/ui";
import { useCourseWizardStep, useCreateLesson } from "../../hooks";
import { steps } from "../../constants";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { resetCreateCourse, setCreateCourse } from "@/redux/createCourse/createCourseSlice";
import { CreateLessonSchema } from "../../schemas";

type CourseWizardButtonsProps = {
  isSubmitting?: boolean;
  showPrev?: boolean;
  disabledNext?: boolean;
  ignoreSubmit?: boolean;
  hasLessonsReordered?: boolean;
  setHasLessonsReordered?: (value: boolean) => void;
};

export const CourseWizardButtons = ({
  isSubmitting = false,
  showPrev = true,
  disabledNext = false,
  ignoreSubmit,
  hasLessonsReordered,
  setHasLessonsReordered
}: CourseWizardButtonsProps) => {
  const location = useLocation();
  const { goToPrevStep, goToNextStep, escapeForm } = useCourseWizardStep();
  // For handling the course reordering
  const courseId = useSelector((state: RootState) => state.createCourse.courseId);
  const courseLessons = useSelector((state: RootState) => state.createCourse.courseLessons);
  const createCourseLesson = useCreateLesson(courseId);
  const dispatch = useDispatch();

  const currentStepIndex = steps.findIndex((step) => location.pathname.includes(step.path));
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleSaveLessonReorder = async () => {
    if (hasLessonsReordered) {
      createCourseLesson.reorderLessons.mutateAsync({
        courseId,
        lessonIds: courseLessons.map((lesson: CreateLessonSchema) => lesson.lessonId)
      });
      // Because the lessons have been reordered, we need to update the courseLessons in redux
      const lessonsFromServer = await createCourseLesson.getLessonList.refetch().then((res) => res.data || []);
      if (lessonsFromServer.length > 0) {
        dispatch(setCreateCourse({ courseLessons: lessonsFromServer }));
      }
      if (setHasLessonsReordered) {
        setHasLessonsReordered(false);
      }
    }
    setTimeout(() => goToNextStep(), 150); // Use setTimeout to ensure the state is updated before navigating
  };

  const handleCancelCreateCourse = () => {
    dispatch(resetCreateCourse());
    escapeForm();
  };

  return (
    <div className="flex justify-end mt-6 space-x-8">
      <AlertDialog
        title={"Cancel Course Creation"}
        message={"Are you sure you want to cancel course creation? All progress will be lost."}
        onConfirm={handleCancelCreateCourse}
      >
        <div className="px-4 py-2 text-sm text-gray3">Cancel</div>
      </AlertDialog>

      {showPrev && (
        <Button
          type="button"
          variant="outline"
          onClick={() => goToPrevStep()}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 text-gray2 disabled:opacity-50"
        >
          Previous
        </Button>
      )}

      {ignoreSubmit ? (
        <button
          type="button"
          disabled={disabledNext || isSubmitting}
          className="px-4 py-1 text-sm font-semibold text-white rounded-lg h-9 bg-appPrimary hover:bg-appPrimary/80 disabled:opacity-50"
          onClick={handleSaveLessonReorder}
        >
          {isLastStep ? "Save & Finish" : "Save & Continue"}
        </button>
      ) : (
        <button
          type="submit"
          disabled={disabledNext || isSubmitting}
          className="px-4 py-1 text-sm font-semibold text-white rounded-lg h-9 bg-appPrimary hover:bg-appPrimary/80 disabled:opacity-50"
        >
          {isLastStep ? "Save & Finish" : "Save & Continue"}
        </button>
      )}
    </div>
  );
};

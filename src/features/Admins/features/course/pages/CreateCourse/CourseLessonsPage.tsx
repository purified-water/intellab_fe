import { useEffect, useState } from "react";
import { CourseLessonList, CourseWizardButtons, LessonForm } from "../../components/CreateCourse";
import { LessonAction } from "../../types";
import { CreateLessonSchema } from "../../schemas";
import { useDispatch, useSelector } from "react-redux";
import { setCreateCourse, setCurrentCreationStep } from "@/redux/createCourse/createCourseSlice";
import { RootState } from "@/redux/rootReducer";
import { useCreateLesson, useEditingCourse } from "../../hooks";
import { CreateCourseLessonQuizPayload, CreateCourseLessonStepResponse, UpdateCourseLessonPayload } from "@/types";
import { resetCreateLesson, setCreateLesson } from "@/redux/createCourse/createLessonSlice";
import { showToastError } from "@/utils";
import { useToast } from "@/hooks";
import { DEFAULT_QUIZ } from "../../constants";
import { Spinner } from "@/components/ui";
// StepGuard
import { StepGuard } from "../../components/StepGuard";
import { isGeneralStepValid } from "../../utils/courseStepGuard";
import { CREATE_COURSE_STEP_NUMBERS } from "../../constants";

export const CourseLessonsPage = () => {
  const [lessonAction, setLessonAction] = useState<LessonAction>({
    type: "default"
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const courseId = useSelector((state: RootState) => state.createCourse.courseId);
  const courseLessons = useSelector((state: RootState) => state.createCourse.courseLessons);
  const [hasLessonsReordered, setHasLessonsReordered] = useState(false);

  const createCourseLesson = useCreateLesson(courseId);
  const { data: lessonsFromServer = [], isLoading } = createCourseLesson.getLessonList;

  const createCourse = useSelector((state: RootState) => state.createCourse);
  const { isEditingCourse } = useEditingCourse();

  useEffect(() => {
    if (createCourse.currentCreationStep < CREATE_COURSE_STEP_NUMBERS.LESSONS) {
      dispatch(setCurrentCreationStep(CREATE_COURSE_STEP_NUMBERS.LESSONS));
    }
  }, []);

  // Only dispatch once when server data is fetched and redux is empty
  useEffect(() => {
    if (lessonsFromServer.length > 0) {
      dispatch(setCreateCourse({ courseLessons: lessonsFromServer }));
    }
  }, [lessonsFromServer, courseLessons.length, dispatch]);

  // Initially create a lesson to get id then call put to update it
  const handleAddInitialLesson = async () => {
    try {
      const createdLesson: CreateCourseLessonStepResponse = await createCourseLesson.createLesson.mutateAsync({
        courseId,
        cloneLessonId: null
      });
      // Add to the create lesson redux (only id and order is needed)
      dispatch(
        setCreateLesson({
          lessonName: "",
          lessonDescription: "",
          lessonContent: "",
          lessonId: createdLesson.lessonId,
          lessonOrder: createdLesson.lessonOrder,
          hasQuiz: false,
          hasProblem: false,
          lessonQuiz: DEFAULT_QUIZ,
          lessonProblemId: ""
        })
      );
    } catch (error) {
      console.error("Error creating lesson:", error);
      showToastError({ toast: toast.toast, message: "Error creating lesson" });
    }
  };

  const updateLesson = async (data: CreateLessonSchema) => {
    if (lessonAction.type === "add-blank" || lessonAction.type === "add-clone" || lessonAction.type === "edit") {
      const updateLessonPayload: UpdateCourseLessonPayload = {
        lessonId: data.lessonId,
        lessonName: data.lessonName,
        description: data.lessonDescription,
        content: data.lessonContent,
        problemId: data.hasProblem ? (data.lessonProblemId ?? null) : null,
        lessonOrder: data.lessonOrder ?? 0
      };

      const updateQuizPayload: CreateCourseLessonQuizPayload = {
        lessonId: data.lessonId,
        isQuizVisible: data.hasQuiz,
        questionsPerExercise: data.lessonQuiz?.displayedQuestions ?? 0,
        passingQuestions: data.lessonQuiz?.requiredCorrectQuestions ?? 0,
        questions: (data.lessonQuiz?.quizQuestions ?? []).map((question) => {
          // For new questions (created locally), send null as questionId
          const isNewQuestion = question.questionId?.startsWith("new-");
          return {
            questionId: isNewQuestion ? null : question.questionId,
            questionContent: question.questionTitle,
            correctAnswer: question.correctAnswer.toString(),
            questionType: "S",
            optionRequests: question.options.map((option) => ({
              order: option.order,
              content: option.option
            }))
          };
        })
      };

      try {
        // Update lesson content first
        await createCourseLesson.updateLesson.mutateAsync(updateLessonPayload);

        // Only update quiz if hasQuiz is true
        if (data.hasQuiz) {
          // Update quiz second
          await createCourseLesson.updateQuiz.mutateAsync(updateQuizPayload);
        }

        // Update the lesson in the course lessons list
        let updatedLessonList;
        if (lessonAction.type === "edit") {
          // For edit, find and update the existing lesson
          updatedLessonList = courseLessons.map((lesson) => (lesson.lessonId === data.lessonId ? data : lesson));
        } else {
          // For add (blank or clone), append the new lesson
          updatedLessonList = [...courseLessons, data];
        }
        // Remove the lesson in the redux store
        dispatch(resetCreateLesson());

        dispatch(setCreateCourse({ courseLessons: updatedLessonList }));
        setLessonAction({ type: "default" });
      } catch (error) {
        console.error("Error updating lesson or quiz:", error);
        showToastError({ toast: toast.toast, message: "Error updating lesson" });
        throw error; // Re-throw to prevent further processing
      }
    } else {
      return;
    }
  };

  const renderDefaultAction = () => {
    return (
      <div className="flex items-center justify-center w-full h-56">
        <h2 className="text-base">Select a lesson to view or edit.</h2>
      </div>
    );
  };

  const renderPageContent = () => {
    switch (lessonAction?.type) {
      case "view":
        return (
          <LessonForm
            lessonId={lessonAction.lessonId}
            onSave={updateLesson}
            onCancel={() => setLessonAction({ type: "default" })}
            lessonActionType="view"
          />
        );
      case "edit":
        return (
          <LessonForm
            lessonId={lessonAction.lessonId}
            onSave={updateLesson}
            onCancel={() => setLessonAction({ type: "default" })}
            lessonActionType="edit"
          />
        );
      case "add-blank":
        return <LessonForm onSave={updateLesson} onCancel={() => setLessonAction({ type: "default" })} />; // Dont add lessonId because use redux instead
      case "add-clone":
        return <div>Add Clone Lesson</div>;
      default:
        return renderDefaultAction();
    }
  };

  let redirectUrl = "/admin/courses/create/general";
  if (isEditingCourse) {
    redirectUrl += "?editCourse=true";
  }

  return (
    <StepGuard checkValid={isGeneralStepValid} redirectTo={redirectUrl}>
      <div className="flex w-full">
        {isLoading ? (
          <div className="flex items-center justify-center w-24">
            <Spinner loading={isLoading} />
          </div>
        ) : (
          <CourseLessonList
            lessons={courseLessons}
            onSelect={setLessonAction}
            onCreateLesson={handleAddInitialLesson}
            setHasLessonsReordered={setHasLessonsReordered}
          />
        )}

        <div className="flex-1 p-4">
          {renderPageContent()}
          {lessonAction.type !== "add-blank" && lessonAction.type !== "add-clone" && (
            <CourseWizardButtons
              disabledNext={courseLessons.length <= 0}
              ignoreSubmit={true}
              hasLessonsReordered={hasLessonsReordered}
              setHasLessonsReordered={setHasLessonsReordered}
            />
          )}
        </div>
      </div>
    </StepGuard>
  );
};

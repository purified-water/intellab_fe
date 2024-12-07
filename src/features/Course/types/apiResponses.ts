import { ICourse } from "./course";
import { ILesson } from "./lesson";

interface IGetCourseDetailResponse {
  code: number;
  result: ICourse;
}

interface IGetCourseLessonsResponse {
  code: number;
  result: ILesson[];
}

interface IEnrollCourseResponse {
  id: number;
  userUid: string;
  courseIds: string[];
}

interface IGetLessonDetailResponse {
  code: number;
  result: ILesson;
}

export type { IGetCourseDetailResponse, IGetCourseLessonsResponse, IEnrollCourseResponse, IGetLessonDetailResponse };

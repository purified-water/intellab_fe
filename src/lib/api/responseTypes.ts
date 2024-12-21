import { ICourse } from "../../features/Course/types/course";
import { ILesson } from "../../features/Course/types/lesson";

export interface IGetCoursesResponse {
  code: number;
  result: ICourse[];
}

export interface IGetCourseDetailResponse {
  code: number;
  result: ICourse;
}

export interface IGetCourseLessonsResponse {
  code: number;
  result: ILesson[];
}

export interface IEnrollCourseResponse {
  code: number;
  result: {
    id: number;
    userUid: string;
    courseIds: string[];
  };
}

export interface IGetLessonDetailResponse {
  code: number;
  result: ILesson;
}

export interface IUserCourse {
  enrollId: {
    userUid: string;
    courseId: string;
  };
  progressPercent: number;
  status: string;
  lastAccessedDate: string;
}

export interface IGetUserEnrolledCoursesResponse {
  code: number;
  result: IUserCourse[];
}

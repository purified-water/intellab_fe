import { apiClient } from "./apiClient";
import {
  IEnrollCourseResponse,
  IGetCourseDetailResponse,
  IGetCourseLessonsResponse,
  IGetLessonDetailResponse
} from "@/features/Course/types";
//import { terminal } from "virtual:terminal"; // for debugging

export const courseAPI = {
  getCourseDetail: async (courseId: string) => {
    const response: IGetCourseDetailResponse = await apiClient.get(`/course/courses/${courseId}`);
    return response;
    // return {
    //   "code": 0,
    //   "result": {
    //     "id": "e2148e8e-e706-4338-b445-afe406e1c90d",
    //     "name": "C++ For Beginners - 1",
    //     "description": "Basic knowledge of C++ programming language",
    //     "level": "Beginner",
    //     "userEnrolled": false
    //   }
    // } as IGetCourseDetailResponse;
  },

  getLessons: async (courseId: string) => {
    const response: IGetCourseLessonsResponse = await apiClient.get(`/course/courses/${courseId}/lessons`);
    return response;
    // return {
    //   "code": 0,
    //   "result": [
    //     {
    //       "id": "c7a7e6bd-a5ba-4d13-97fe-db0144524dd9",
    //       "lessonOrder": 1,
    //       "name": "The First C++ Program",
    //       "description": "Hello World!",
    //       "content": "# The Hello Word program\n Some code sample here\n # Explanation\n Some explanation here\n",
    //       "courseId": "8ab6ad07-aa9d-4ca1-9680-72e2e98bbb81"
    //     }
    //   ] as ILesson[]
    // } as IGetCourseLessonsResponse;
  },

  enrollCourse: async (useUid: string, courseId: string) => {
    const response: IEnrollCourseResponse = await apiClient.post(`/course/enroll`, {
      userUid: useUid,
      courseId: courseId
    });
    return response;

    // return {
    //   "id": 0,
    //   "userUid": "123",
    //   "courseIds": ["e2148e8e-e706-4338-b445-afe406e1c90d"]
    // } as IEnrollCourseResponse
  },

  getLessonDetail: async (lessonId: string) => {
    const response: IGetLessonDetailResponse = await apiClient.get(`/course/lessons/${lessonId}`);
    return response;
    // return {
    //   "code": 0,
    //   "result": {
    //     "id": "c7a7e6bd-a5ba-4d13-97fe-db0144524dd9",
    //     "lessonOrder": 1,
    //     "name": "The First C++ Program",
    //     "description": "Hello World!",
    //     "content": "# The Hello Word program\n ## Code sample\n ```A code block sample here```\n ## Explanation\n - Some explanation here\n - Some conclusion here\n # Summary\n - Some summary here\n",
    //     "courseId": "8ab6ad07-aa9d-4ca1-9680-72e2e98bbb81"
    //   } as ILesson
    // } as IGetLessonDetailResponse;
  }
};

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import courseReducer from "@/redux/course/courseSlice";
import problemReducer from "@/redux/problem/problemSlice";
import userReducer from "@/redux/user/userSlice";
import { userCodeReducer } from "@/redux/problem/problemSlice";
import submissionReducer from "./problem/submissionSlice";
import commentReducer from "./comment/commentSlice";
import mainChatbotReducer from "./mainChatbot/mainChatbotSlice";
import premiumStatusReducer from "./premiumStatus/premiumStatusSlice";
import notifcationsReducer from "./notifications/notificationsSlice";
import lessonChatbotReducer from "./lessonChatbot/lessonChatbotSlice";
import createCourseReducer from "./createCourse/createCourseSlice";
import createLessonReducer from "./createCourse/createLessonSlice";
import createTestcaseReducer from "./createProblem/createTestcaseSlice";
import createProblemReducer from "./createProblem/createProblemSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  problem: problemReducer,
  user: userReducer,
  userCode: userCodeReducer,
  submission: submissionReducer,
  comment: commentReducer,
  mainChatbot: mainChatbotReducer,
  premiumStatus: premiumStatusReducer,
  notifications: notifcationsReducer,
  lessonChatbot: lessonChatbotReducer,
  createCourse: createCourseReducer,
  createLesson: createLessonReducer,
  createProblem: createProblemReducer,
  createTestcase: createTestcaseReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

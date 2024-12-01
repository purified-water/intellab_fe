import { MarkdownRender, Quiz } from "../components";
import { IQuiz } from "@/types";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { courseAPI } from "@/lib/api";
import { ILesson } from "@/features/Course/types";
//import { terminal } from "virtual:terminal";

// const markdownContent = `
// # Heading 1
// - **Some content here**.
// ## Heading 2
// More content here.

// ### Heading 3
// Even more content here.

// # Heading 1
// Some content here.

// ## Heading 2
// More content here.
// ***

// ### Heading 3
// Even more content here.

// # Heading 1
// Some content here.

// ## Heading 2
// More content here.
// ***

// ### Heading 3
// Even more content here.

// # Heading 1
// Some content here.

// ## Heading 2
// More content here.
// ***

// ### Heading 3
// Even more content here.

// # Heading 1
// Some content here.

// ## Heading 2
// More content here.
// ***

// ### Heading 3
// Even more content here.

// # Heading 1
// Some content here.

// ## Heading 2
// More content here.
// ***

// ### Heading 3
// Even more content here.
// `;

// const quiz: IQuiz = {
//   question: "What is a String?",
//   answers: [
//     { label: "A", content: "A sequence of characters", isCorrect: true },
//     { label: "B", content: "A type of number", isCorrect: false },
//     { label: "C", content: "A boolean value", isCorrect: false }
//   ]
// };

// const nextLesson = "Characters";

export const LessonDetailPage = () => {
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const { id } = useParams<{ id: string }>();

  const getLessonDetail = async () => {
    const response = await courseAPI.getLessonDetail(id!);
    const { code, result } = response;
    setLesson(result);
  };

  useEffect(() => {
    getLessonDetail();
  }, []);

  const renderHeader = () => {
    return (
      <div className="border-b border-gray-300 py-4 space-y-2">
        <p className="text-5xl font-bold">{lesson?.name}</p>
        <p className="text-gray3">{lesson?.description}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (lesson?.content != null) {
      return <MarkdownRender content={lesson?.content!} />;
    }
  };

  // NOTE: No property defined for quiz in API so temporarily commenting out this code
  // const renderQuiz = () => {
  //   return (
  //     <div className="space-y-4">
  //       <p className="text-4xl font-bold">Quiz</p>
  //       <Quiz quiz={quiz} />
  //     </div>
  //   );
  // };

  // const renderNextLesson = () => {
  //   return (
  //     nextLesson && (
  //       <div
  //         className="flex items-center py-3 px-3 border-y border-gray4 gap-2 max-w-7xl cursor-pointer"
  //         onClick={() => console.log("Navigate to next lesson")}
  //       >
  //         <p>Continue to next Lesson:</p>
  //         <p className="font-bold">{nextLesson}</p>
  //         <div className="ml-auto">
  //           <ChevronRight style={{ color: "gray" }} size={22} />
  //         </div>
  //       </div>
  //     )
  //   );
  // };

  return (
    <div className="p-5 pl-20 space-y-8">
      {renderHeader()}
      {renderContent()}
      {/* {renderQuiz()}
      {renderNextLesson()} */}
    </div>
  );
};

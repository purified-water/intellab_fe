import { Link } from "react-router-dom";
import { MarkdownRender } from "../MarkdownRender";
import { testMD } from "../../constants/testMD";
import BreadCrump, { IBreadCrumpItem } from "@/components/ui/BreadCrump";

interface ProblemDescriptionProps {
  problemDescription: string;
  courseId: string | null;
  courseName: string | null;
  lessonId: string | null;
  lessonName: string | null;
}

export const ProblemDescription = (props: ProblemDescriptionProps) => {
  const { problemDescription, courseId, courseName, lessonId, lessonName } = props;

  const breadCrumpItems: IBreadCrumpItem[] = [
    {
      path: `/course/${courseId}`,
      title: courseName!
    },
    {
      path: `/lesson/${lessonId}`,
      title: lessonName!
    }
  ];

  const renderTitle = () => {
    let content;
    if (courseId && courseName && lessonId && lessonName) {
      content = <BreadCrump items={breadCrumpItems} />;
    } else {
      content = (
        <Link to="/problems" className="font-medium underline text-appAccent">
          Public
        </Link>
      );
    }

    return content;
  };

  return (
    <div className="h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      {renderTitle()}
      <h1 className="mt-2 text-xl font-semibold">1. Two Sum</h1>
      <MarkdownRender content={testMD} />
    </div>
  );
};

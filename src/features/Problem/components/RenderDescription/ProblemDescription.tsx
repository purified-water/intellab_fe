import { Link } from "react-router-dom";
import { MarkdownRender } from "../MarkdownRender";
import BreadCrump, { IBreadCrumpItem } from "@/components/ui/BreadCrump";
import { ProblemType } from "@/types/ProblemType";
import { LevelCard } from "./LevelCard";
interface ProblemDescriptionProps {
  problemDetail: ProblemType | null;
  courseId: string | null;
  courseName: string | null;
  lessonId: string | null;
  lessonName: string | null;
}

export const ProblemDescription = (props: ProblemDescriptionProps) => {
  const { problemDetail, courseId, courseName, lessonId, lessonName } = props;

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
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      {renderTitle()}
      <h1 className="mt-2 text-2xl font-bold">{problemDetail?.problemName}</h1>
      <LevelCard level={problemDetail?.problemLevel || ""} />
      <MarkdownRender content={problemDetail?.description || ""} />
    </div>
  );
};

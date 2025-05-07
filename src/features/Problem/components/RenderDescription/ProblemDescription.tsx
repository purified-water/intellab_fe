import { Link } from "react-router-dom";
import { MarkdownRender } from "../ProblemMarkdownRender";
import BreadCrump, { IBreadCrumpItem } from "@/components/ui/BreadCrump";
import { ProblemType } from "@/types/ProblemType";
import { LevelCard } from "./LevelCard";
import { CircleCheck } from "lucide-react";
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
      path: `/lesson/${lessonId}?courseId=${courseId}`,
      title: lessonName!
    }
  ];

  const renderTitle = () => {
    let content;
    if (courseId && courseName && lessonId && lessonName) {
      content = <BreadCrump items={breadCrumpItems} />;
    } else {
      content = (
        <Link to="/problems" className="text-base font-bold cursor-pointer text-appPrimary hover:underline">
          Public
        </Link>
      );
    }

    return content;
  };

  return (
    <div className="flex-wrap h-full pb-12 my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      {renderTitle()}
      <div className="flex justify-between mt-2">
        <h1 className="text-2xl font-bold">{problemDetail?.problemName}</h1>
        {problemDetail?.isSolved && (
          <div className="flex items-center px-2 mt-1">
            <span className="mr-1 text-sm">Solved</span>
            <CircleCheck className="size-4 text-appEasy" />
          </div>
        )}
      </div>

      <LevelCard level={problemDetail?.problemLevel || ""} categories={problemDetail?.categories} />
      <MarkdownRender content={problemDetail?.description || ""} />
    </div>
  );
};

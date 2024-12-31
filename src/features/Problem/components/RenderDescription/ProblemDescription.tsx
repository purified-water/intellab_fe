import { Link } from "react-router-dom";
import { MarkdownRender } from "../MarkdownRender";
import { testMD } from "../../constants/testMD";

export const ProblemDescription = () => {
  return (
    <div className="h-full my-4 ml-6 mr-4 overflow-y-auto scrollbar-hide">
      <Link to="/problems" className="font-medium underline text-appAccent">
        Public
      </Link>
      <h1 className="mt-2 text-xl font-semibold">1. Two Sum</h1>
      <MarkdownRender content={testMD} />
    </div>
  );
};

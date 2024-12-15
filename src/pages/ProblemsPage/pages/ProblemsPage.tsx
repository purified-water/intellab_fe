import SearchBar from "@/pages/ProblemsPage/components/SearchBar";
import FilterButton from "@/pages/ProblemsPage/components/FilterButton";
import { ProblemListItem } from "@/pages/ProblemsPage/components/ProblemListItem";

export const ProblemsPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center py-10 pl-10">
        <FilterButton onClick={() => {}} />
        <SearchBar />
      </div>

      <div className="w-full h-[106px] flex flex-col pl-10 mb-4">
        <div className="mb-2 text-5xl font-bold tracking-wide text-appPrimary">Welcome to Intellab problems!</div>
        <div>Improve your problem sovling skills here!</div>
      </div>

      <div className="w-full px-10">
        <ProblemListItem />
      </div>
    </div>
  );
};

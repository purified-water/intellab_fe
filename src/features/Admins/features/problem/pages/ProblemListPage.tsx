import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { FilterButton, SearchBar } from "@/features/Problem/components";
import { ProblemList } from "../components";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from "@/components/ui";
// import { FilterDialog } from "../components/FilterDialog";
import { useGetAdminProblemList } from "../hooks";
import { AdminProblemParams } from "../types/ProblemListType";
import { APIMetaData } from "@/types";
// import { useCourseCategories } from "../../course/hooks";
import { useDispatch } from "react-redux";
import { resetCreateProblem } from "@/redux/createProblem/createProblemSlice";

const TABS = {
  CREATED: "created",
  DRAFT: "draft"
};

export function ProblemListPage() {
  const [activeTab, setActiveTab] = useState(TABS.CREATED);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<AdminProblemParams>({
    isComplete: true,
    page: 0
  });
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  // const { data: categories, isLoading: loadingCategories } = useCourseCategories();
  const { data, isLoading: loadingProblems } = useGetAdminProblemList(filter);
  const problems = data?.result.content || [];
  const meta = data?.result || ({} as APIMetaData);

  useEffect(() => {
    if (meta) {
      // If theres 1 page, the api return 0 so we set it to 1
      setTotalPages(meta.totalPages === 0 ? 1 : meta.totalPages);
    }
  }, [meta]);

  const renderHeader = () => {
    const handleKeywordSearch = (query: string) => {
      setFilter((prev) => ({
        ...prev,
        keyword: query
      }));
    };

    const handleCreateProblem = () => {
      dispatch(resetCreateProblem());
      navigate("/admin/problems/create/general");
    };

    return (
      <div className="flex items-center">
        <FilterButton onClick={() => setShowFilter(!showFilter)} />
        <SearchBar value={""} onSearch={handleKeywordSearch} width={800} />
        <div className="pl-4 ml-2 border-l border-gray4">
          <Button
            onClick={handleCreateProblem}
            className="px-4 py-5 text-lg font-semibold rounded-lg bg-appPrimary hover:bg-appPrimary hover:opacity-80"
          >
            <Plus className="w-4 h-4" />
            New Problem
          </Button>
        </div>
      </div>
    );
  };

  const renderProblemList = () => {
    const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      setFilter((prev) => ({
        ...prev,
        isComplete: tab === TABS.CREATED ? true : false
      }));
    };

    return (
      <div className="min-w-[1100px]">
        <Tabs defaultValue={TABS.CREATED} value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-transparent h-auto p-0 rounded-none">
            {[TABS.CREATED, TABS.DRAFT].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={`rounded-none data-[state=active]:shadow-none 
                  data-[state=active]:text-appAccent data-[state=active]:border-b-2 
                  data-[state=active]:border-appAccent  py-2 px-3 font-semibold text-xl`}
              >
                {tab === TABS.CREATED ? "Created Problems" : "Draft Problems"}
              </TabsTrigger>
            ))}
          </TabsList>

          <ProblemList problems={problems} isLoading={loadingProblems} filter={filter} tab={activeTab} />

          {totalPages && totalPages > 1 && (
            <Pagination
              currentPage={filter.page || 0}
              totalPages={totalPages}
              onPageChange={(page) => setFilter((prev) => ({ ...prev, page }))}
            />
          )}
        </Tabs>
      </div>
    );
  };

  // const renderFilterDialog = () => {
  //   return <FilterDialog isVisible={showFilter} currentFilter={filter} onFilter={setFilter} categories={categories || []} />;
  // };

  return (
    <div className="px-2 space-y-6">
      <h1 className="text-4xl font-bold text-appPrimary">Problems</h1>
      <div className="mx-auto space-y-3 justify-items-center">
        {renderHeader()}
        {/* {renderFilterDialog()} */}
        {renderProblemList()}
      </div>
    </div>
  );
}

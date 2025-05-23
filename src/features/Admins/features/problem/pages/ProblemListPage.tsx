import { useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { FilterButton, SearchBar } from "@/features/Problem/components";
import { ProblemList } from "../components";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
// import { FilterDialog } from "../components/FilterDialog";
import { ProblemFilterType } from "@/types/ProblemType";
// import { useCourseCategories } from "../../course/hooks";

const TABS = {
  CREATED: "created",
  DRAFT: "draft"
};

export function ProblemListPage() {
  const [activeTab, setActiveTab] = useState(TABS.CREATED);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<ProblemFilterType>({
    keyword: "",
    level: null,
    status: null,
    categories: null
  });
  const navigate = useNavigate();

  // const { data: categories, isLoading: loadingCategories } = useCourseCategories();

  const renderHeader = () => {
    const handleKeywordSearch = (query: string) => {
      setFilter((prev) => ({
        ...prev,
        keyword: query
      }));
    };

    return (
      <div className="flex items-center">
        <FilterButton onClick={() => setShowFilter(!showFilter)} />
        <SearchBar value={filter?.keyword || ""} onSearch={handleKeywordSearch} width={800} />
        <div className="pl-4 ml-2 border-l border-gray4">
          <Button
            onClick={() => navigate("/admin/problems/create")}
            className="px-4 py-5 text-lg font-semibold rounded-lg bg-appPrimary hover:bg-appPrimary hover:opacity-80"
          >
            <Plus className="w-4 h-4" />
            New Problem
          </Button>
        </div>
      </div>
    );
  };

  const renderCourseList = () => {
    const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      setFilter((prev) => ({
        ...prev,
        isCompletedCreation: tab === TABS.CREATED ? true : false
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
          <ProblemList filter={filter} tab={activeTab} />
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
        {renderCourseList()}
      </div>
    </div>
  );
}

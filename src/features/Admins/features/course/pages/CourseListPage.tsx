import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/shadcn/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { FilterButton, SearchBar } from "@/features/Problem/components";
import { CourseList, FilterDialog } from "../components";
import { TCourseFilter } from "@/types";

const TABS = {
  CREATED: "created",
  DRAFT: "draft"
};

export function CourseListPage() {
  const [activeTab, setActiveTab] = useState(TABS.CREATED);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<TCourseFilter>({
    keyword: "",
    categories: [],
    rating: null,
    levels: [],
    prices: [],
    priceRange: { min: 0, max: 1000000 },
    isCompletedCreation: true
  });

  const renderHeader = () => {
    const handleKeywordSearch = (query: string) => {
      setFilter((prev) => ({
        ...prev,
        keyword: query
      }));
    };

    return (
      <div className="flex items-center justify-between">
        <FilterButton onClick={() => setShowFilter(!showFilter)} />
        <SearchBar value={filter?.keyword || ""} onSearch={handleKeywordSearch} />
        <div className="border-l border-gray4 pl-3">
          <Button className="bg-appPrimary hover:bg-appPrimary hover:opacity-80 rounded-lg font-semibold text-lg py-5 px-4">
            <Plus className="h-4 w-4" />
            New Course
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
      <div className="">
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
                {tab === TABS.CREATED ? "Created Courses" : "Draft Courses"}
              </TabsTrigger>
            ))}
          </TabsList>
          <CourseList filter={filter} />
        </Tabs>
      </div>
    );
  };

  const renderFilterDialog = () => {
    return <FilterDialog isVisible={showFilter} currentFilter={filter} onFilter={setFilter} />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-appPrimary">Courses</h1>
      <div className="ml-8 space-y-3">
        {renderHeader()}
        {renderFilterDialog()}
        {renderCourseList()}
      </div>
    </div>
  );
}

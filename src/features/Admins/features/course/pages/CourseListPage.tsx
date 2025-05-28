import { useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { FilterButton, SearchBar } from "@/features/Problem/components";
import { CourseList, FilterDialog } from "../components";
import { TCourseFilter } from "@/types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { useDispatch } from "react-redux";
import { resetCreateCourse } from "@/redux/createCourse/createCourseSlice";

const TABS = {
  CREATED: "created",
  DRAFT: "draft"
};

export function CourseListPage() {
  const [activeTab, setActiveTab] = useState(TABS.CREATED);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<TCourseFilter>({
    keyword: "",
    categories: null,
    rating: null,
    levels: null,
    prices: null,
    priceRange: null,
    isCompletedCreation: true
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const renderHeader = () => {
    const handleKeywordSearch = (query: string) => {
      setFilter((prev) => ({
        ...prev,
        keyword: query
      }));
    };

    const handleCreateCourse = () => {
      dispatch(resetCreateCourse());
      navigate("/admin/courses/create/general");
    };

    return (
      <div className="flex items-center">
        <FilterButton onClick={() => setShowFilter(!showFilter)} />
        <SearchBar value={filter?.keyword || ""} onSearch={handleKeywordSearch} width={800} />
        <div className="pl-4 ml-2 border-l border-gray4">
          <Button
            onClick={handleCreateCourse}
            className="px-4 py-5 text-base font-semibold rounded-lg bg-appPrimary hover:bg-appPrimary hover:opacity-80"
          >
            <Plus className="w-4 h-4" />
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
    <div className="px-2 space-y-6">
      <h1 className="text-4xl font-bold text-appPrimary">Courses</h1>
      <div className="mx-auto space-y-3 justify-items-center">
        {renderHeader()}
        {renderFilterDialog()}
        {renderCourseList()}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import { FilterButton, SearchBar } from "@/features/Problem/components";
import { ProblemList } from "../components";
import { Button, Pagination } from "@/components/ui";
import { useGetAdminProblemList } from "../hooks";
import { AdminProblemParams } from "../types/ProblemListType";
import { APIMetaData } from "@/types";
import { useCourseCategories } from "../../course/hooks";
import { AdminProblemFilterDialog } from "../components/AdminProblemFilterDialog";
import { SEO } from "@/components/SEO";
import { CreateProblemModal } from "../components/CreateProblem";

const TABS = {
  CREATED: "created",
  DRAFT: "draft"
};

export function ProblemListPage() {
  const [activeTab, setActiveTab] = useState(TABS.CREATED);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<AdminProblemParams>({
    isCompletedCreation: true,
    keyword: "",
    page: 0
  });
  const [temporaryKeyword, setTemporaryKeyword] = useState(filter.keyword || "");
  const [showCreateProblemModal, setShowCreateProblemModal] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  const { data: categories, isLoading: isLoadingCategories } = useCourseCategories();
  const { data, isLoading: loadingProblems, refetch: refetchProblems } = useGetAdminProblemList(filter);
  const problems = data?.result.content || [];
  const meta = data?.result || ({} as APIMetaData);

  const handleCloseCreateProblemModal = () => {
    setShowCreateProblemModal(false);
  };

  const handleImportProblemFromPolygonSuccess = () => {
    setShowCreateProblemModal(false);
    setFilter((prev) => ({ ...prev, isCompletedCreation: false, page: 0 }));
    setTemporaryKeyword("");

    if (activeTab === TABS.CREATED) {
      setActiveTab(TABS.DRAFT);
    } else {
      refetchProblems();
    }
  };

  useEffect(() => {
    if (meta) {
      // If theres 1 page, the api return 0 so we set it to 1
      setTotalPages(meta.totalPages === 0 ? 1 : meta.totalPages);
    }
  }, [meta]);

  const renderHeader = () => {
    const handleKeywordSearch = (query: string) => {
      setTemporaryKeyword(query);
      setFilter((prev) => ({ ...prev, keyword: query, page: 0 }));
    };

    const handleCreateProblem = () => {
      setShowCreateProblemModal(true);
    };

    return (
      <>
        <SEO title="Problem Management | Intellab" />
        <div className="flex items-center">
          <FilterButton onClick={() => setShowFilter(!showFilter)} />
          <SearchBar value={temporaryKeyword} onSearch={handleKeywordSearch} width={800} />
          <div className="pl-4 ml-2 border-l border-gray4">
            <Button
              onClick={handleCreateProblem}
              className="px-4 py-5 text-base font-semibold rounded-lg bg-appPrimary hover:bg-appPrimary hover:opacity-80"
            >
              <Plus className="w-4 h-4" />
              New Problem
            </Button>
          </div>
        </div>
      </>
    );
  };

  const renderProblemList = () => {
    const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      setFilter((prev) => ({
        ...prev,
        isCompletedCreation: tab === TABS.CREATED ? true : false,
        page: 0 // Reset to first page when switching tabs
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

  const renderFilterDialog = () => {
    const handleApplyFilter = (newFilter: AdminProblemParams) => {
      // Preserve the isCompletedCreation based on the current active tab
      setFilter({
        ...newFilter,
        isCompletedCreation: activeTab === TABS.CREATED ? true : false
      });
    };

    return (
      <AdminProblemFilterDialog
        isVisible={showFilter}
        currentFilter={filter}
        onApplyFilter={handleApplyFilter}
        categories={categories || []}
        isLoadingCategories={isLoadingCategories}
      />
    );
  };

  const renderCreateProblemModal = () => {
    return (
      <CreateProblemModal
        open={showCreateProblemModal}
        onClose={handleCloseCreateProblemModal}
        onImportProblemSuccess={handleImportProblemFromPolygonSuccess}
      />
    );
  };

  return (
    <div className="container max-w-[1200px] mx-auto space-y-8 mb-12">
      <h1 className="mx-4 text-4xl font-bold text-appPrimary">Problem Management</h1>
      <div className="space-y-3 justify-items-center">
        {renderHeader()}
        {renderFilterDialog()}
        {renderProblemList()}
      </div>
      {renderCreateProblemModal()}
    </div>
  );
}

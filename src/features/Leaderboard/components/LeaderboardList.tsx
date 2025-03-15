import { useEffect, useState } from "react";
import { LeaderboardItem } from "./LeaderboardItem";
import { TLeaderboardRank } from "@/types";
import { SortByButton, ISortByItem, Pagination } from "@/components/ui";
import { leaderboardAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

const FILTER_ITEMS: ISortByItem[] = [
  {
    value: "all",
    label: "Overall"
  },
  {
    value: "problem",
    label: "Problem"
  },
  {
    value: "course",
    label: "Course"
  }
];

export function LeaderboardList() {
  const toast = useToast();

  const [filterValue, setFilterValue] = useState(FILTER_ITEMS[0].value);
  const [data, setData] = useState<TLeaderboardRank[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const getLeaderboardAPI = async (page: number) => {
    setLoading(true);
    try {
      const response = await leaderboardAPI.getLeaderboard(filterValue, page);
      setData(response.content);
      if (!totalPages) {
        setTotalPages(response.totalPages);
      } else {
        if (response.totalPages == 0) {
          setTotalPages(null);
        }
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Failed to get leaderboard data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      getLeaderboardAPI(currentPage);
    }
  }, [filterValue, currentPage]);

  const renderSortingButton = () => {
    return (
      <SortByButton title="Filter by: " items={FILTER_ITEMS} selectedValue={filterValue} onSelect={setFilterValue} />
    );
  };

  const renderPagination = () => {
    let content = null;
    if (totalPages && totalPages != 0) {
      content = (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      );
    }
    return content;
  };

  const renderItemsSkeleton = () => {
    const placeHolder = [1, 2, 3];
    return placeHolder.map((_, index) => <LeaderboardItem key={index} rank={index} item={null} loading={true} />);
  };

  const renderItems = () => {
    return data.map((rank, index) => (
      <LeaderboardItem key={index} rank={currentPage * 10 + index + 1} item={rank} loading={false} />
    ));
  };

  const renderEmpty = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-lg text-gray3">Currently, there is no data.</p>
      </div>
    );
  };

  let body = null;
  const isEmpty = data.length == 0 && !loading;
  if (loading) {
    body = renderItemsSkeleton();
  } else {
    body = renderItems();
  }

  return (
    <div className="w-4/6 space-y-4">
      {renderSortingButton()}
      <table className="text-gray2 font-normal w-full">
        <thead>
          <tr className="border-b border-gray5">
            <th className="w-[80px] py-3">#</th>
            <th className="text-left pl-12">User</th>
            <th className="w-1/6 text-left">Points</th>
          </tr>
        </thead>
        <tbody>{!isEmpty && body}</tbody>
      </table>
      {isEmpty && renderEmpty()}
      {renderPagination()}
    </div>
  );
}

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
    label: "Solved problems"
  }
  // {
  //   value: "course",
  //   label: "Completed courses"
  // }
];

export function LeaderboardList() {
  const toast = useToast();

  const [filterValue, setFilterValue] = useState(FILTER_ITEMS[0].value);
  const [data, setData] = useState<TLeaderboardRank[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const getLeaderboardAPI = async (page: number) => {
    await leaderboardAPI.getLeaderboard({
      query: {
        filter: filterValue,
        page: page
      },
      onStart: async () => setLoading(true),
      onSuccess: async (response) => {
        setData(response.content);
        if (!totalPages) {
          setTotalPages(response.totalPages);
        } else {
          if (response.totalPages == 0) {
            setTotalPages(null);
          }
        }
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message: message }),
      onEnd: async () => setLoading(false)
    });
  };

  useEffect(() => {
    getLeaderboardAPI(currentPage);
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

  const renderSkeleton = () => {
    const placeHolder = [1, 2, 3, 4, 5];
    return placeHolder.map((_, index) => (
      <LeaderboardItem key={index} rank={index} item={null} loading={true} filterValue={filterValue} />
    ));
  };

  const renderItems = () => {
    return data.map((rank, index) => (
      <LeaderboardItem
        key={index}
        rank={currentPage * 10 + index + 1}
        item={rank}
        loading={false}
        filterValue={filterValue}
      />
    ));
  };

  const renderEmpty = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-lg text-gray3">No data available.</p>
      </div>
    );
  };

  const renderAdditionalColumns = () => {
    let result = null;
    switch (filterValue) {
      case "problem":
        result = (
          <>
            <th className="w-[80px] text-left">Easy</th>
            <th className="w-[80px] text-left">Medium</th>
            <th className="w-[80px] text-left">Hard</th>
          </>
        );
        break;
      case "course":
        result = (
          <>
            <th className="w-[100px] text-left">Beginner</th>
            <th className="w-[120px] text-left">Intermediate</th>
            <th className="w-[100px] text-lef">Advanced</th>
          </>
        );
        break;
      default:
        // all
        result = null;
        break;
    }
    return result;
  };

  let body = null;
  const isEmpty = data.length == 0 && !loading;
  if (loading) {
    body = renderSkeleton;
  } else {
    body = renderItems;
  }

  return (
    <div className="w-full space-y-4">
      {renderSortingButton()}
      <table className="w-full font-normal text-gray2">
        <thead>
          <tr className="border-b border-gray5">
            <th className="w-[80px] py-3">#</th>
            <th className="pl-12 text-left">User</th>
            <th className="w-[100px] text-left">Points</th>
            {renderAdditionalColumns()}
          </tr>
        </thead>
        <tbody>{!isEmpty && body()}</tbody>
      </table>
      {isEmpty && renderEmpty()}
      {renderPagination()}
    </div>
  );
}

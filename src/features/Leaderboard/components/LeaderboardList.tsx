import { useEffect, useState } from "react";
import { LeaderboardItem } from "./LeaderboardItem";
import { TRank } from "../types";
import { SortByButton, ISortByItem } from "@/components/ui";

type LeaderboardListProps = {
  data: TRank[];
};

const FILTER_ITEMS: ISortByItem[] = [
  {
    value: "overall",
    label: "Overall"
  }
];

export function LeaderboardList(props: LeaderboardListProps) {
  const { data } = props;

  const [filterValue, setFilterValue] = useState(FILTER_ITEMS[0].value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [filterValue]);

  const renderSortingButton = () => {
    return (
      <SortByButton title="Filter by: " items={FILTER_ITEMS} selectedValue={filterValue} onSelect={setFilterValue} />
    );
  };

  const renderItemsSkeleton = () => {
    const placeHolder = [1, 2, 3];
    return placeHolder.map((item) => <LeaderboardItem key={item} item={null} loading={true} />);
  };

  const renderItems = () => {
    return data.map((rank) => <LeaderboardItem key={rank.rank} item={rank} loading={false} />);
  };

  return (
    <div className="w-4/6">
      {renderSortingButton()}
      <table className="mt-4 text-gray2 font-normal w-full">
        <thead>
          <tr className="border-b border-gray5">
            <th className="w-[80px] py-3">#</th>
            <th className="text-left pl-12">User</th>
            <th className="w-1/6 text-left">Points</th>
          </tr>
        </thead>
        <tbody>{loading ? renderItemsSkeleton() : renderItems()}</tbody>
      </table>
    </div>
  );
}

import { useState } from "react";
import { LeaderboardItem } from "./LeaderboardItem";
import { TRank } from "../types";
import { SortByButton, ISortByItem } from "@/components/ui";

type LeaderboardListProps = {
  data: TRank[];
};

const FILTER_ITEMS: ISortByItem[] = [
  {
    value: "created,desc",
    label: "Most Recent"
  },
  {
    value: "numberOfLikes,desc",
    label: "Most Upvoted"
  },
  {
    value: "created,asc",
    label: "Oldest"
  }
];

export function LeaderboardList(props: LeaderboardListProps) {
  const { data } = props;

  const [filterValue, setFilterValue] = useState(FILTER_ITEMS[0].value);

  const renderSortingButton = () => {
    return (
      <SortByButton title="Filter by: " items={FILTER_ITEMS} selectedValue={filterValue} onSelect={setFilterValue} />
    );
  };

  return (
    <div>
      {renderSortingButton()}

      <div className="bg-white p-4 rounded-lg shadow-md">
        {data.map((rank) => (
          <LeaderboardItem key={rank.rank} item={rank} />
        ))}
      </div>
    </div>
  );
}

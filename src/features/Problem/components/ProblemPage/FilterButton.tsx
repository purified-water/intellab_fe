import React from "react";

interface FilterButtonProps {
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button
      className="h-10 px-6 pt-2 pb-[9px] bg-white rounded-lg text-appPrimary border border-appPrimary justify-center items-center inline-flex hover:bg-appPrimary hover:text-white transition-colors duration-200"
      onClick={onClick}
    >
      <div className="text-lg font-semibold">Filter</div>
    </button>
  );
};

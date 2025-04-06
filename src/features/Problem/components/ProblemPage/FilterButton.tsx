import React from "react";

interface FilterButtonProps {
  onClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button
      className="w-[104px] h-10 px-[27px] pt-2 pb-[9px] bg-white rounded-[10px] border border-appPrimary justify-center items-center inline-flex hover:opacity-80"
      onClick={onClick}
    >
      <div className="text-lg font-semibold leading-snug text-appPrimary">Filter</div>
    </button>
  );
};

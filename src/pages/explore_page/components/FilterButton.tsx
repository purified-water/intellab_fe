import React from "react";

interface FilterButtonProps {
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button
      className="w-[104px] h-10 px-[27px] pt-2 pb-[9px] bg-white rounded-[10px] border border-[#8b65c4] justify-center items-center inline-flex"
      onClick={onClick}
    >
      <div className="text-[#5a3295] text-xl font-semibold leading-snug">Filter</div>
    </button>
  );
};

export default FilterButton;

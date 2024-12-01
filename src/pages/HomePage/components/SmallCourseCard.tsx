import { SmCourseCardType } from "@/pages/HomePage/types/SmCourseCardType";

export const SmallCourseCard = ({ title, description, price, buttonText }: SmCourseCardType) => {
  const handleCourseClicked = () => {};

  return (
    <div className="flex flex-col justify-between w-64 h-40 p-4 text-white rounded-lg bg-gradient-to-r from-appPrimary to-appFadedPrimary shrink-0">
      <div>
        <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
        <p className="text-sm line-clamp-1">{description}</p>
      </div>
      <div className="flex justify-between mt-2">
        <button
          className="self-end px-4 py-1 text-base font-bold text-black bg-white rounded-lg"
          onClick={handleCourseClicked}
        >
          {buttonText}
        </button>
        {price && <p className="self-end mt-2 font-bold">{price}</p>}
      </div>
    </div>
  );
};

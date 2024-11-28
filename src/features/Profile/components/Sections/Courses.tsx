export const Courses = () => {
  const courseItems = [
    { title: "Course Title 1", date: "a month ago" },
    { title: "Course Title 2", date: "2 weeks ago" },
    { title: "Course Title 3", date: "1 week ago" }
  ];

  return (
    <div className="w-full h-auto lg:h-[400px] bg-white rounded-[10px] flex flex-col">
      <div className="flex items-center justify-between p-6">
        <p className="text-3xl font-bold text-appPrimary">My Courses</p>
        <button className="text-lg underline text-appPrimary" onClick={() => {}}>
          View All
        </button>
      </div>
      <div className="mx-6 border-t-2 border-gray-300"></div>
      <div className="flex flex-col">
        {courseItems.map((course, index) => (
          <div
            key={index}
            className={`max-w-full h-[62px] rounded-[10px] mx-6 mt-5 flex items-start justify-between ${
              index % 2 === 0 ? "bg-[#e0e0e0]" : ""
            }`}
          >
            <div className="px-4 pt-4 text-lg font-bold text-[#01000f]">{course.title}</div>
            <div className="px-4 pt-4 text-lg text-slate-500">{course.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

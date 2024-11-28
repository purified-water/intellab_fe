export const Submissions = () => {
  const submissionItems = [
    { title: "Problem 1", date: "a month ago", status: "accepted" },
    { title: "Problem 2", date: "2 weeks ago", status: "unaccepted" },
    { title: "Problem 3", date: "1 week ago", status: "accepted" }
  ];

  return (
    <div className="w-full h-auto lg:h-[400px] bg-white rounded-[10px] flex flex-col">
      <p className="p-6 text-3xl font-bold text-appPrimary">My Submissions</p>
      <div className="mx-6 border-t-2 border-gray-300"></div>
      <div className="flex flex-col">
        {submissionItems.map((submission, index) => (
          <div
            key={index}
            className={`max-w-full h-[62px] rounded-[10px] mx-6 mt-5 flex items-start justify-between ${
              index % 2 === 0 ? "bg-[#e0e0e0]" : ""
            }`}
          >
            <div
              className={`px-4 pt-4 text-lg font-bold ${
                submission.status === "accepted" ? "text-green-500" : "text-red-500"
              }`}
            >
              {submission.title}
            </div>
            <div className="px-4 pt-4 text-lg text-slate-500">{submission.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

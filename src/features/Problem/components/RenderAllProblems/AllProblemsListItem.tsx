import { MdCheckCircleOutline } from "rocketicons/md";

type Row = {
  status: string;
  title: string;
  hints: string;
  level: string;
  category: string;
};

const data: Row[] = [
  { status: "solved", title: "1. Two Sum", hints: "True", level: "Medium", category: "String, Hash table" },
  { status: "", title: "1. Two Sum", hints: "False", level: "Easy", category: "String, Hash table, Array, Numbers" },
  { status: "", title: "1. Two Sum", hints: "False", level: "Easy", category: "String, Hash table, Array, Numbers" },
  {
    status: "solved",
    title: "1. Two Sum",
    hints: "False",
    level: "Hard",
    category: "String, Hash table, Array, Numbers"
  },
  { status: "", title: "1. Two Sum", hints: "False", level: "Easy", category: "String, Hash table, Array, Numbers" }
  // Add more rows as needed
];

export const AllProblemsListItem = () => {
  const handleProblemClicked = () => {
    console.log("Problem clicked");
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full table-auto">
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={handleProblemClicked}
              className={`cursor-pointer hover:cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
            >
              <td className="w-6 px-4 py-2 text-center">
                {row.status === "solved" ? <MdCheckCircleOutline className="icon-appEasy" /> : ""}
              </td>

              <td className="w-4/6 px-4 py-2 font-semibold">{row.title}</td>

              <td
                className={`px-4 py-2 w-1/6 font-semibold ${
                  row.level === "Easy" ? "text-appEasy" : row.level === "Medium" ? "text-appMedium" : "text-appHard"
                }`}
              >
                {row.level}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

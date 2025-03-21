import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { useNavigate } from "react-router-dom";

const purchases: Purchase[] = [
  {
    dateIssued: "Jan 22, 2025",
    description: "Intellab Course Plan (Month)",
    amount: "199,000 VND",
    status: "Paid"
  },
  {
    dateIssued: "Jan 22, 2025",
    description: "Intellab Course Plan (Month)",
    amount: "199,000 VND",
    status: "Failed"
  }
];

// interface ProblemListItemProps {
//   purchases: Purchase[];
// };

type Purchase = {
  dateIssued: string;
  description: string;
  amount: string;
  status: "Paid" | "Failed" | "Pending";
};

export const PurchaseList = () => {
  const navigate = useNavigate();

  const handlePurchaseClicked = () => {
    navigate("/my-purchases/receipt/123");
  };
  return (
    <div className="flex justify-center overflow-x-auto">
      <table className="min-w-fit w-[1000px] table-auto">
        <thead className="border-b">
          <tr className="text-xs sm:text-base">
            {["Date Issued", "Description", "Amount", "Status"].map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-center cursor-pointer text-gray2"
                // onClick={() => handleSort(header.toLowerCase() as keyof Problem)}
              >
                <div className="flex items-center">
                  <p>{header}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {purchases.map((row, index) => (
            <tr
              key={index}
              className={`cursor-pointer text-xs sm:text-base ${index % 2 === 0 ? "bg-white" : "bg-gray6"}`}
              onClick={handlePurchaseClicked}
            >
              <td className="w-12 py-2 pl-4 text-left">{row.dateIssued}</td>
              <td className="w-2/6 px-4 py-2 font-semibold hover:text-appPrimary">{row.description}</td>
              <td className="w-20 px-4 py-2 text-left">{row.amount}</td>
              <td
                className={`px-4 py-2 w-28 font-semibold ${
                  row.status === "Paid" ? "text-appEasy" : row.status === "Pending" ? "text-appMedium" : "text-appHard"
                }`}
              >
                {capitalizeFirstLetter(row.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

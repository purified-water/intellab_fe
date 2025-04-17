import { CheckCircle, Minus } from "lucide-react";

type Perk = {
  name: string;
  freePlan: string | boolean;
  algorithmPlan: string | boolean;
  coursePlan: string | boolean;
  premiumPlan: string | boolean;
};

const perksData: Perk[] = [
  { name: "Access to public problems", freePlan: true, algorithmPlan: true, coursePlan: true, premiumPlan: true },
  { name: "Access to free courses", freePlan: true, algorithmPlan: true, coursePlan: true, premiumPlan: true },
  { name: "Intellab AI Assistant", freePlan: true, algorithmPlan: true, coursePlan: true, premiumPlan: true },
  { name: "Summary course with AI", freePlan: true, algorithmPlan: true, coursePlan: true, premiumPlan: true },
  {
    name: "Messages/day with problem Assistant",
    freePlan: "7",
    algorithmPlan: "Unlimited",
    coursePlan: "20",
    premiumPlan: "Unlimited"
  },
  { name: "Access to advanced AI models", freePlan: false, algorithmPlan: true, coursePlan: true, premiumPlan: true },
  { name: "Access to premium problem", freePlan: false, algorithmPlan: true, coursePlan: false, premiumPlan: true },
  { name: "Free access to all courses", freePlan: false, algorithmPlan: false, coursePlan: true, premiumPlan: true }
];

const PerkCell = ({ value }: { value: string | boolean }) => {
  if (typeof value === "boolean") {
    return value ? <CheckCircle className="w-5 h-5 mx-auto" /> : <Minus className="w-4 h-6 mx-auto" />;
  }
  return <span>{value}</span>;
};

export function PerksTable() {
  const plans = ["Free Plan", "Algorithm Plan", "Course Plan", "Premium Plan"];

  return (
    <table className="w-full">
      <thead>
        <tr className="text-lg font-semibold text-left border-b">
          <th className="px-4 py-3 ">Perks</th>
          {plans.map((plan, index) => (
            <th key={index} className="px-12 py-3 text-center">
              {plan}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {perksData.map((perk, index) => (
          <tr key={index} className="text-base font-semibold border-b">
            <td className="px-4 py-3 ">{perk.name}</td>
            <td className="px-12 py-3 text-center">
              <PerkCell value={perk.freePlan} />
            </td>
            <td className="px-12 py-3 text-center">
              <PerkCell value={perk.algorithmPlan} />
            </td>
            <td className="px-12 py-3 text-center">
              <PerkCell value={perk.coursePlan} />
            </td>
            <td className="px-12 py-3 text-center">
              <PerkCell value={perk.premiumPlan} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

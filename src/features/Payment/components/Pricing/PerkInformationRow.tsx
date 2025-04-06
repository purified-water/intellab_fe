import { CircleCheck } from "lucide-react";

type PerkInformationRowProps = {
  content: string;
};

export function PerkInformationRow(props: PerkInformationRowProps) {
  const { content } = props;
  return (
    <div className="flex my-1 gap-2 items-start">
      <CircleCheck size={20} className="mt-1" />
      <div className="w-[280px] text-base">{content}</div>
    </div>
  );
}

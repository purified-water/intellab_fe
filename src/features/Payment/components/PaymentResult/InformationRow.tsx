type InformationRowProps = {
  label: string;
  value: string;
};

export function InformationRow(props: InformationRowProps) {
  const { label, value } = props;

  return (
    <div className="flex w-full justify-between">
      <p className="font-bold flex-[4]">{label}</p>
      <p className="flex-[6] text-right">{value}</p>
    </div>
  );
}

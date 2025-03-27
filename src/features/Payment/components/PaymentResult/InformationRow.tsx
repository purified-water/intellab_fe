import React from "react";

type InformationRowProps = {
  label: string;
  value: string;
};

export function InformationRow(props: InformationRowProps) {
  const { label, value } = props;

  return (
    <div className="flex w-full justify-between">
      <p className="font-bold">{label}</p>
      <p>{value}</p>
    </div>
  );
}

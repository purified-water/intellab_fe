interface RequiredInputLabelProps {
  label: string;
  className?: string;
}

export const RequiredInputLabel = ({ label, className }: RequiredInputLabelProps) => {
  return (
    <div className={className}>
      {label}
      <span className="text-appHard">*</span>
    </div>
  );
};

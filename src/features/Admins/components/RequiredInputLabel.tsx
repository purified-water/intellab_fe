interface RequiredInputLabelProps {
  label: string;
  className?: string;
  required?: boolean;
}

export const RequiredInputLabel = ({ label, className, required = true }: RequiredInputLabelProps) => {
  return (
    <div className={className}>
      {label}
      {required && <span className="text-appHard">*</span>}
    </div>
  );
};

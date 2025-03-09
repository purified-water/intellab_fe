import React from "react";

type InputFieldProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
};

export function InputField(props: InputFieldProps) {
  const { label, type = "text", value, placeholder, onChange, name, disabled, error, errorMessage } = props;

  return (
    <div className="w-[360px]">
      <label className="block text-sm font-medium text-gray3">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className={`mt-1 w-full border-gray4 rounded-lg px-4 py-2 border ${disabled ? "bg-gray6" : "bg-white"} ${error ? "border-red-500" : ""}`}
      />
      {error && errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}

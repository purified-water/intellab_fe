import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";

type CustomInputFieldProps = {
  label: string;
  type?: string;
  name: string;

  // Prioritize register over onChange
  register?: any;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
};

export function CustomInputField({
  label,
  type = "text",
  name,
  register,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  errorMessage,
  className = "",
}: CustomInputFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const sharedProps = {
    name,
    placeholder,
    disabled,
    className: `mt-1 w-full focus:outline-appPrimary focus:outline-1 border rounded-lg px-4 py-2 ${
      disabled ? "bg-gray-100" : "bg-white"
    } ${error ? "border-red-500" : "border-gray-300"} ${className}`,
    ...(register ? register : { value, onChange }), // Enable register or onChange
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {type === "password" ? (
        <div className="relative">
          <input type={passwordVisible ? "text" : "password"} {...sharedProps} />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
          >
            {passwordVisible ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
          </button>
        </div>
      ) : (
        <input type={type} {...sharedProps} />
      )}

      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}

import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";

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
  const [passwordVisible, setPasswordVisible] = useState(false);

  const renderTextType = () => {
    return (
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className={`mt-1 w-full border-gray4 rounded-lg px-4 py-2 border ${disabled ? "bg-gray6" : "bg-white"} ${error ? "border-red-500" : ""}`}
      />
    );
  };

  const renderPasswordType = () => {
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    return (
      <div className="relative">
        <input
          type={passwordVisible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          disabled={disabled}
          className={`mt-1 w-full border-gray4 rounded-lg px-4 py-2 border ${disabled ? "bg-gray6" : "bg-white"} ${error ? "border-red-500" : ""}`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute top-1 inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        >
          {passwordVisible ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
        </button>
      </div>
    );
  };

  let inputField = null;
  if (type === "password") {
    inputField = renderPasswordType();
  } else {
    inputField = renderTextType();
  }

  return (
    <div className="w-[360px]">
      <label className="block text-sm font-medium text-gray3">{label}</label>
      {inputField}
      {error && errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}

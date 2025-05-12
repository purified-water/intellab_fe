import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils/toastUtils";
import { FaSpinner } from "rocketicons/fa6";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "rocketicons/md";
import { authAPI } from "@/lib/api";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const done = searchParams.get("done");

  const [inputs, setInputs] = useState({
    password: "",
    confirmPassword: ""
  });

  const [inputErrors, setInputErrors] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const reduxUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    document.title = "Forgot password | Intellab";
  }, []);

  const inputValidation = () => {
    let isValid = true;
    const errors = { password: "", confirmPassword: "" };

    if (inputs.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    if (inputs.confirmPassword.length < 6) {
      errors.confirmPassword = "Confirm password must be at least 6 characters";
      isValid = false;
    } else if (inputs.password !== inputs.confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password do not match ";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const changePasswordAPI = async () => {
    await authAPI.updatePassword({
      body: {
        newPassword: inputs.password,
        token: token!
      },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        if (data) {
          showToastSuccess({
            toast: toast.toast,
            title: "Password changed successfully!",
            message: "Your password has been changed successfully.",
            duration: 5000
          });
          navigate("/profile/reset-password?done=true");
        } else {
          showToastError({ toast: toast.toast, message: "Failed to change password" });
        }
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message }),
      onEnd: async () => setLoading(false)
    });
  };

  const handleChangePassword = async () => {
    if (inputValidation()) {
      await changePasswordAPI();
    }
  };

  const renderDescription = () => {
    return <div className="p-2 font-semibold text-2xl border-b">Change Password</div>;
  };

  const renderChangePasswordButton = () => {
    return (
      <button
        onClick={handleChangePassword}
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-2 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <FaSpinner className="inline-block mr-2 icon-sm animate-spin icon-white" />
            Changing password...
          </div>
        ) : (
          "Change password"
        )}
      </button>
    );
  };

  const renderDone = () => {
    return (
      <div className="mt-6 space-y-6 text-center">
        {reduxUser && (
          <p className="font-semibold text-appPrimary">
            You have already logged in as <strong>{reduxUser.email}</strong>.
          </p>
        )}
        <p className="text-gray2">Your password has been changed.</p>
        {!reduxUser && (
          <button
            className="w-[200px] py-2 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90"
            onClick={() => navigate("/login")}
          >
            Login now!
          </button>
        )}
      </div>
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInputs = () => {
    return (
      <form id="reset-password-form" className="mt-6" onSubmit={handleChangePassword}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              onFocus={() => setInputErrors({ ...inputErrors, password: "" })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 flex items-center justify-center text-gray3 right-2 top-1 focus:outline-none"
            >
              {showPassword ? (
                <MdOutlineVisibilityOff className="icon-lg" />
              ) : (
                <MdOutlineVisibility className="icon-lg" />
              )}
            </button>
          </div>
          {inputErrors.password && <p className="mt-2 text-sm text-appHard">{inputErrors.password}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
              onFocus={() => setInputErrors({ ...inputErrors, confirmPassword: "" })}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 flex items-center justify-center text-gray3 right-2 top-1 focus:outline-none"
            >
              {showPassword ? (
                <MdOutlineVisibilityOff className="icon-lg" />
              ) : (
                <MdOutlineVisibility className="icon-lg" />
              )}
            </button>
          </div>
          {inputErrors.confirmPassword && <p className="mt-2 text-sm text-appHard">{inputErrors.confirmPassword}</p>}
        </div>
      </form>
    );
  };

  let content = null;
  if (done) {
    content = renderDone();
  } else {
    content = (
      <>
        {renderInputs()}
        {renderChangePasswordButton()}
      </>
    );
  }

  return (
    <div className="flex justify-center items-start h-screen bg-gray5">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-12">
        {renderDescription()}
        {content}
      </div>
    </div>
  );
};

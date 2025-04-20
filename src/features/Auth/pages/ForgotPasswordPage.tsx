import intellab_bottom from "@/assets/logos/intellab_bottom.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils/toastUtils";
import { FaSpinner } from "rocketicons/fa6";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

export const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [inputErrors, setInputErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const emailSent = searchParams.get("emailSent");
  const reduxUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    document.title = "Forgot password | Intellab";
  }, []);

  const inputValidation = (email: string) => {
    let isValid = true;
    let errors = "";

    if (!email) {
      errors = "Email is required";
      isValid = false;
    }

    setInputErrors(errors);
    return isValid;
  };

  const resetPasswordAPI = async (sendingEmail: string) => {
    await authAPI.resetPassword({
      body: { email: sendingEmail },
      onStart: async () => setLoading(true),
      onSuccess: async (data) => {
        if (data) {
          showToastSuccess({
            toast: toast.toast,
            title: "Reset link sent successfully!",
            message: `We sent a password reset link to ${sendingEmail}, please check your inbox.`,
            duration: 5000
          });
          navigate("/forgot-password?emailSent=true");
        } else {
          showToastError({ toast: toast.toast, message: "Failed to send password reset email" });
        }
      },
      onFail: async (message) => showToastError({ toast: toast.toast, message }),
      onEnd: async () => setLoading(false)
    });
  };

  const handleForgotPassword = async () => {
    if (inputValidation(email)) {
      await resetPasswordAPI(email);
    }
  };

  const renderLogo = () => {
    return (
      <div className="flex flex-col items-center">
        <img src={intellab_bottom} alt="Intellab Logo" className="h-16" />
      </div>
    );
  };

  const renderDescription = () => {
    return (
      <div className="border border-gray4 rounded-lg p-3 mt-6 text-gray2">
        Enter your email address and we will send you a link to reset your password.
      </div>
    );
  };

  const renderEmailInput = () => {
    return (
      <div className="mt-6">
        <label htmlFor="email" className="block text-sm font-bold text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setInputErrors("")}
          placeholder="Enter your email"
          className="w-full px-4 py-2 mt-1 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-appPrimary"
        />
        {inputErrors && <p className="mt-2 text-sm text-appHard">{inputErrors}</p>}
      </div>
    );
  };

  const renderResetPasswordButton = () => {
    return (
      <button
        onClick={handleForgotPassword}
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-2 font-semibold text-white transition rounded-lg bg-appPrimary hover:opacity-90 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <FaSpinner className="inline-block mr-2 icon-sm animate-spin icon-white" />
            Sending email...
          </div>
        ) : (
          "Reset my password"
        )}
      </button>
    );
  };

  const renderSentEmailMessage = () => {
    return (
      <div className="mt-6 space-y-4 text-center">
        {reduxUser && (
          <p className="font-semibold text-appPrimary">
            You are already logged in as <strong>{reduxUser.email}</strong>.
          </p>
        )}
        <p className="text-gray2">A password reset link has been sent to your email. Please check your inbox.</p>
      </div>
    );
  };

  let content = null;
  if (emailSent) {
    content = renderSentEmailMessage();
  } else {
    content = (
      <>
        {renderDescription()}
        {renderEmailInput()}
        {renderResetPasswordButton()}
      </>
    );
  }

  return (
    <div className="flex justify-center items-start h-screen bg-gray5">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mt-12">
        {renderLogo()}
        {content}
      </div>
    </div>
  );
};

import { useToast } from "@/hooks";
import { authAPI } from "@/lib/api";
import { RootState } from "@/redux/rootReducer";
import { showToastError, showToastSuccess } from "@/utils";
import { useSelector } from "react-redux";

export const VerifyAccountBanner = () => {
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isEmailVerified = reduxUser?.isEmailVerified;
  const userEmail = reduxUser?.email;
  const toast = useToast();

  if (!userEmail) {
    return null;
  }

  const handleResendVerificationEmail = async () => {
    await authAPI.resendVerificationEmail({
      body: {
        email: userEmail
      },
      onSuccess: async () =>
        showToastSuccess({
          toast: toast.toast,
          title: "Email sent successfully",
          message: `We sent a verification email to ${userEmail}, please check your inbox.`,
          duration: 5000
        }),
      onFail: async (error) =>
        showToastError({ toast: toast.toast, title: "Failed to send verification email", message: error })
    });
  };

  return (
    !isEmailVerified && (
      <div className="flex items-center justify-center gap-4 px-6 py-2 bg-opacity-25 rounded-lg bg-appHard/20">
        <p className="font-semibold text-appHard">Verify your account to have full access!</p>
        <button onClick={handleResendVerificationEmail} className="hover:underline text-appInfo">
          Resend the verification email
        </button>
      </div>
    )
  )
}

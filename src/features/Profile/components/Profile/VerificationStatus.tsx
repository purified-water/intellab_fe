import { MdWarning } from "rocketicons/md";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { showToastError, showToastSuccess } from "@/utils";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

type VerificationStatusProps = {
  showFull?: boolean;
};

export function VerificationStatus(props: VerificationStatusProps) {
  const { showFull = false } = props;

  const toast = useToast();
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isEmailVerified = reduxUser?.isEmailVerified;
  const userEmail = reduxUser!.email;

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
      <div className="flex bg-appHard bg-opacity-25 rounded-lg py-2 px-6 items-center gap-5">
        <MdWarning className={`text-appPrimary size-${showFull ? "12" : "8"} icon-appHard`} />
        <div className="text-appHard">
          <p className="font-bold">Account Not Verified</p>
          {showFull && <p>You account has not been verified yet.</p>}
          {showFull && (
            <button className="hover:underline text-appInfo" onClick={handleResendVerificationEmail}>
              Click here to resend the verification email.
            </button>
          )}
        </div>
      </div>
    )
  );
}

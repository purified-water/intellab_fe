import { useState, useEffect } from "react";
import { EmailVerifiedBlock } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { showToastError } from "@/utils/toastUtils";
import { useToast } from "@/hooks/use-toast";
import { TokenRefreshManager } from "@/lib/api";
import { setEmailVerified } from "@/redux/user/userSlice";

export function EmailVerifiedPage() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const reduxUser = useSelector((state: RootState) => state.user.user);

  const handleRefreshToken = async () => {
    setLoading(true);
    try {
      await TokenRefreshManager.handleTokenRefresh();
      if (!reduxUser!.isEmailVerified) {
        dispatch(setEmailVerified());
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({
          toast: toast.toast,
          title: "Error refreshing token",
          message: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefreshToken();
  }, []);

  return (
    <div className="flex justify-center h-screen bg-gray5 pt-20">
      <div>
        <EmailVerifiedBlock loading={loading} />
      </div>
    </div>
  );
}

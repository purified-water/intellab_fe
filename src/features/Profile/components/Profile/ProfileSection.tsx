import { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { userAPI } from "@/lib/api";
import { IUser } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils/toastUtils";
import { API_RESPONSE_CODE, DELAY_TIMES } from "@/constants";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Switch } from "@/components/ui/shadcn/switch";
import { Eye, EyeOff } from "lucide-react";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { VerificationStatus } from "./VerificationStatus";
import { setUser as setReduxUser } from "@/redux/user/userSlice";

type ProfileSectionProps = {
  userId: string;
  onProfileFetched: (isPublic: boolean) => void;
};

export const ProfileSection = memo(function ProfileSection(props: ProfileSectionProps) {
  const { userId, onProfileFetched } = props;

  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isMe = userId === reduxUser?.userId;
  const navigate = useNavigate();
  const toast = useToast();
  const width = useWindowDimensions().width;
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const isPublicProfile = user?.public || false;
  const [isToggling, setIsToggling] = useState(false); // State to prevent spam clicks

  const getProfileSinglePublicAPI = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfilePublic(userId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        setUser(result);
        onProfileFetched(result.public || isMe);
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error getting user profile" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToastError({ toast: toast.toast, message: error.message ?? "Error getting user profile" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isToggling) {
      getProfileSinglePublicAPI();
    }
  }, [userId, reduxUser]);

  useEffect(() => {
    document.title = `${user?.displayName ?? "Loading"} | Intellab`;
  }, [user]);

  const handleToggleProfileVisibility = async () => {
    // Prevent spam clicks
    if (isToggling) return;

    await userAPI.setPublicProfile({
      body: { isPublic: !isPublicProfile },
      onStart: async () => setIsToggling(true), // Set toggling state to true to prevent multiple clicks
      onSuccess: async () => {
        dispatch(setReduxUser({ ...reduxUser, public: !isPublicProfile }));
        setUser((prevUser) => (prevUser ? { ...prevUser, public: !isPublicProfile } : null));
        dispatch(setReduxUser({ ...reduxUser, public: !isPublicProfile }));
        showToastSuccess({
          toast: toast.toast,
          title: "Profile visibility updated",
          message: `Your profile is now ${!isPublicProfile ? "public" : "private"}`
        });
      },
      onFail: async (message) =>
        showToastError({ toast: toast.toast, message: message ?? "Error updating profile visibility" }),
      onEnd: async () => {
        // Reset toggling state after a delay to prevent spam
        setTimeout(() => {
          setIsToggling(false);
        }, DELAY_TIMES.MEDIUM);
      }
    });
  };

  const renderProfilePhoto = () => {
    return (
      <img
        src={user?.photoUrl || DEFAULT_AVATAR}
        alt="profile"
        className="object-contain w-20 h-20 border rounded-full"
        onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
      />
    );
  };

  let nameWidth = width / 9;
  if (width < 1025) {
    nameWidth = width / 2.5;
  }
  const fullName = `${user?.firstName} ${user?.lastName.slice(0, 10)}`;

  const renderSkeleton = () => {
    return (
      <div className="flex flex-col w-full pt-6">
        <div className="flex items-center">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex flex-col items-start justify-center pl-4">
            <Skeleton className="w-20 h-6 mb-2" />
            <Skeleton className="w-20 h-5 mb-5" />
            <div>
              <Skeleton className="inline-block w-12 h-6" />
              <Skeleton className="inline-block w-16 h-6 ml-2" />
            </div>
          </div>
        </div>
        {/* <Skeleton className="min-w-full h-[50px] mt-[42px] rounded-[10px]" /> */}
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center">
          {renderProfilePhoto()}
          <div className="flex flex-col items-start justify-center py-4 pl-4 ">
            <p
              className="text-xl font-semibold truncate text-black1"
              style={{ maxWidth: nameWidth }}
              title={user?.displayName ?? "User_name"}
            >
              {user?.displayName ?? "User_name"}
            </p>
            <div className="mb-2 text-base font-normal truncate text-gray3" style={{ maxWidth: nameWidth }}>
              {fullName}
            </div>
          </div>
        </div>
        {isMe && <VerificationStatus />}
        {isMe && (
          <>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray6">
              <div className="flex items-center gap-2">
                {isPublicProfile ? <Eye className="w-4 h-4 text-gray1" /> : <EyeOff className="w-4 h-4 text-gray1" />}
                <span className="text-sm font-medium text-gray1">
                  {isPublicProfile ? "Public Profile" : "Private Profile"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray3">
                  {isPublicProfile ? "Visible to everyone" : "Hidden from public"}
                </span>
                <Switch
                  checked={isPublicProfile}
                  onCheckedChange={handleToggleProfileVisibility}
                  disabled={isToggling}
                  className={isToggling ? "cursor-not-allowed opacity-70" : ""}
                />
              </div>
            </div>
            <button
              className="min-w-full py-2 font-semibold bg-transparent rounded-lg border-appPrimary border-[1px] text-appPrimary hover:bg-appPrimary hover:text-white transition-colors duration-200"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    );
  };

  return loading ? renderSkeleton() : renderProfile();
});

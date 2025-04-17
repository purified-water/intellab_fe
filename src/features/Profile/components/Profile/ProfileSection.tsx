import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import { userAPI } from "@/lib/api";
import { IUser } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { API_RESPONSE_CODE } from "@/constants";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { VerificationStatus } from "./VerificationStatus";

type ProfileSectionProps = {
  userId: string;
};

export const ProfileSection = (props: ProfileSectionProps) => {
  const { userId } = props;
  const reduxUser = useSelector((state: RootState) => state.user.user);
  const isMe = userId === reduxUser?.userId;
  const navigate = useNavigate();
  const toast = useToast();
  const width = useWindowDimensions().width;

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  const getProfileSinglePublicAPI = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfilePublic(userId);
      const { code, message, result } = response;
      if (code == API_RESPONSE_CODE.SUCCESS) {
        setUser(result);
      } else {
        showToastError({ toast: toast.toast, message: message ?? "Error getting user profile" });
      }
    } catch (e) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting user profile" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileSinglePublicAPI();
  }, [userId]);

  useEffect(() => {
    document.title = `${user?.displayName ?? "Loading"} | Intellab`;
  }, [user]);

  const renderProfilePhoto = () => {
    let avatar = DEFAULT_AVATAR;
    const userPhoto = user?.photoUrl;
    if (userPhoto) {
      avatar = userPhoto;
    }
    return <img src={avatar} alt="profile" className="object-contain w-20 h-20 rounded-full" />;
  };

  let nameWidth = width / 9;
  if (width < 1025) {
    nameWidth = width / 2.5;
  }
  const fullName = `${user?.firstName} ${user?.lastName}`;

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
            <div>
              <span className="text-base font-normal text-black1">Rank:</span>
              <span className="text-base font-semibold text-black1"> EMPTY VALUE</span>
            </div>
          </div>
        </div>
        {isMe && <VerificationStatus />}
        {isMe && (
          <button
            className="min-w-full py-2 font-bold bg-transparent rounded-lg border-appPrimary border-[1px] text-appPrimary mt-2 hover:opacity-80"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>
        )}
      </div>
    );
  };

  return loading ? renderSkeleton() : renderProfile();
};

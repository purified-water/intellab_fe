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

  const renderProfilePhoto = () => {
    let content = <i className="text-9xl fa-solid fa-circle-user"></i>;
    const userPhoto = user?.photoUrl;
    if (userPhoto) {
      content = (
        <img src={userPhoto} alt="profile" className="object-contain w-20 h-20 border rounded-full border-gray4" />
      );
    }
    return content;
  };

  let nameWidth = width / 9;
  if (width < 1025) {
    nameWidth = width / 2.5;
  }
  const fullName = `${user?.firstName} ${user?.lastName}`;

  const renderSkeleton = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex flex-col items-start justify-center pl-4">
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-36 h-5 mb-5" />
            <div>
              <Skeleton className="w-12 h-6 inline-block" />
              <Skeleton className="w-16 h-6 inline-block ml-2" />
            </div>
          </div>
        </div>
        <Skeleton className="min-w-full h-[50px] mt-[42px] rounded-[10px]" />
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center">
          {renderProfilePhoto()}
          <div className="flex flex-col items-start justify-center pl-4">
            <p
              className="text-xl font-semibold truncate text-black1"
              style={{ maxWidth: nameWidth }}
              title={user?.displayName ?? "User_name"}
            >
              {user?.displayName ?? "User_name"}
            </p>
            <div className="mb-5 text-base font-normal truncate text-gray3" style={{ maxWidth: nameWidth }}>
              {fullName}
            </div>
            <div>
              <span className="text-lg font-normal text-black1">Rank:</span>
              <span className="text-lg font-semibold text-black1"> 1,000</span>
            </div>
          </div>
        </div>
        {isMe && (
          <button
            className="min-w-full h-[50px] font-bold bg-transparent rounded-[10px] border-appPrimary border-[1px] text-appPrimary mt-[42px]"
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

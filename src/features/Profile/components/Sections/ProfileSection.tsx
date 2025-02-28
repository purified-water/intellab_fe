import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";

export const ProfileSection = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const renderProfilePhoto = () => {
    let content = <i className="text-9xl fa-solid fa-circle-user"></i>;
    const userPhoto = user?.photoUrl;
    if (userPhoto) {
      content = <img src={userPhoto} alt="profile" className="w-32 h-32 rounded-full object-contain" />;
    }
    return content;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {renderProfilePhoto()}
        <div className="flex flex-col items-start justify-center pl-5">
          <div className="text-2xl font-semibold text-black1">{`${user?.firstName} ${user?.lastName}`}</div>
          <div className="mb-5 text-base font-normal text-gray3">{user?.displayName}</div>{" "}
          <div>
            <span className="text-lg font-normal text-black1">Rank:</span>
            <span className="text-lg font-semibold text-black1"> 1,000</span>
          </div>
        </div>
      </div>
      <button
        className="min-w-full h-[50px] font-bold bg-transparent rounded-[10px] border-appPrimary border-[1px] text-appPrimary mt-[42px]"
        onClick={() => {}}
      >
        Edit Profile
      </button>
    </div>
  );
};

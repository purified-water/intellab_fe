import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "@/hooks/use-window-dimensions";

export const ProfileSection = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const width = useWindowDimensions().width;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

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

  let nameWidth = width / 11;
  if (width < 1025) {
    nameWidth = 900;
  }

  const fullName = `${user?.firstName} ${user?.lastName}`;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center">
        {renderProfilePhoto()}
        <div className="flex flex-col items-start justify-center pl-4">
          <p className="text-xl font-semibold truncate text-black1 line-clamp-1" title={user?.displayName}>
            {user?.displayName}
          </p>
          <div className="mb-5 text-base font-normal truncate text-gray3" style={{ maxWidth: nameWidth }}>
            {fullName}
          </div>{" "}
          <div>
            <span className="text-lg font-normal text-black1">Rank:</span>
            <span className="text-lg font-semibold text-black1"> 1,000</span>
          </div>
        </div>
      </div>
      <button
        className="min-w-full h-[50px] font-bold bg-transparent rounded-[10px] border-appPrimary border-[1px] text-appPrimary mt-[42px]"
        onClick={() => navigate("/profile/edit")}
      >
        Edit Profile
      </button>
    </div>
  );
};

import { useState } from "react";
import { InputField } from "./InputField";
import { AvatarModal } from "./AvatarModal";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils/toastUtils";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { Copy, Pencil, Camera } from "lucide-react";
import { userAPI } from "@/lib/api";
import { setUser } from "@/redux/user/userSlice";
import { Button } from "@/components/ui";
import { HTTPS_STATUS_CODE } from "@/constants";

export function EditProfileSection() {
  const toast = useToast();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);

  const userId = user?.userId;

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    displayName: user?.displayName ?? "",
    email: user?.email,
    currentPassword: "", // getProfileMe API doesn't return current password
    newPassword: "",
    retypePassword: ""
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBasicInfoEditable, setIsBasicInfoEditable] = useState(false);
  const [isAccountInfoEditable, setIsAccountInfoEditable] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    newPassword: "",
    retypePassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateBasicInfo = () => {
    const newErrors = {
      firstName:
        formData.firstName.length === 0 && formData.lastName.length === 0
          ? "At least one of first name or last name is required"
          : "",
      lastName:
        formData.firstName.length === 0 && formData.lastName.length === 0
          ? "At least one of first name or last name is required"
          : ""
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const validateAccountInfo = () => {
    const newErrors = {
      displayName:
        formData.displayName.length >= 4 && formData.displayName.length <= 50
          ? ""
          : "Display name must be between 4 and 50 characters"
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const validateChangePassword = () => {
    const newErrors = {
      newPassword: formData.newPassword.length >= 6 ? "" : "Password must be at least 6 characters",
      retypePassword: formData.newPassword === formData.retypePassword ? "" : "Passwords do not match"
    };
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((error) => error === "");
  };

  const getProfileMeAPI = async () => {
    try {
      const response = await userAPI.getProfileMe();
      if (response) {
        dispatch(setUser(response));
      } else {
        showToastError({ toast: toast.toast, message: "Error getting user profile" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error getting user profile" });
    }
  };

  const updateProfileAPI = async () => {
    const actualPassword = formData.newPassword.length === 0 ? null : formData.newPassword;
    try {
      const response = await userAPI.updateProfile(
        formData.displayName,
        formData.firstName,
        formData.lastName,
        actualPassword
      );
      if (response.status == HTTPS_STATUS_CODE.OK) {
        dispatch(
          setUser({
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            displayName: formData.displayName
          })
        );
        showToastSuccess({ toast: toast.toast, message: "Profile updated successfully" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Failed to update profile" });
    }
  };

  const uploadProfilePhotoAPI = async (file: File) => {
    try {
      const response = await userAPI.uploadProfilePhoto(file);
      const { code, message } = response;
      if (code == HTTPS_STATUS_CODE.OK) {
        await getProfileMeAPI();
        setIsModalOpen(false);
        showToastSuccess({ toast: toast.toast, message: message ?? "Avatar uploaded successfully" });
      } else {
        showToastError({ toast: toast.toast, message: "Failed to upload avatar" });
      }
    } catch (e: any) {
      showToastError({ toast: toast.toast, message: e.message ?? "Error uploading avatar" });
    }
  };

  const renderUserAvatar = () => {
    const handleCopyUserId = async () => {
      try {
        await navigator.clipboard.writeText(userId!);
        showToastSuccess({ toast: toast.toast, message: "UserID copied to clipboard" });
      } catch (e: any) {
        showToastError({ toast: toast.toast, message: e.message ?? "Failed to copy UserID" });
      }
    };

    return (
      <div className="justify-items-center space-y-4 relative">
        <div className="relative group">
          <img
            src={user?.photoUrl}
            alt="User Avatar"
            className="w-24 h-24 border border-gray4 rounded-full cursor-pointer object-contain"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 items-center flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="items-center justify-center">
              <Camera size={24} className="text-white" />
              <span className="text-white text-sm">Edit</span>
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500 flex items-center">
          {userId}
          <button onClick={handleCopyUserId} className="ml-2 text-gray-400 hover:text-gray-600" title="Copy UserID">
            <Copy size={16} />
          </button>
        </span>
      </div>
    );
  };

  const renderBasicInfo = () => {
    const handleCancelBasicInfo = () => {
      setFormData((prev) => ({
        ...prev,
        firstName: user?.firstName || "",
        lastName: user?.lastName || ""
      }));
      setIsBasicInfoEditable(false);
    };

    const handleSaveBasicInfo = async () => {
      if (validateBasicInfo()) {
        await updateProfileAPI();
        setIsBasicInfoEditable(false);
      }
    };

    return (
      <div className="">
        <div className="flex space-x-2 items-center">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          {!isBasicInfoEditable && (
            <button onClick={() => setIsBasicInfoEditable(true)} className="text-gray-500 hover:text-gray-700">
              <Pencil size={16} />
            </button>
          )}
        </div>
        <div className="flex justify-between mt-2">
          <InputField
            label="First name"
            value={formData.firstName}
            onChange={handleChange}
            name="firstName"
            disabled={!isBasicInfoEditable}
            placeholder={formData.firstName ? "" : "Your first name..."}
            error={!!errors.firstName}
            errorMessage={errors.firstName}
          />
          <InputField
            label="Last name"
            value={formData.lastName}
            onChange={handleChange}
            name="lastName"
            disabled={!isBasicInfoEditable}
            placeholder={formData.lastName ? "" : "Your last name..."}
            error={!!errors.lastName}
            errorMessage={errors.lastName}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          * Note: Your first and last name will appear inside your course certificates
        </p>
        {isBasicInfoEditable && (
          <div className="mt-4 flex justify-end space-x-2 font-bold">
            <Button
              onClick={handleCancelBasicInfo}
              variant={"outline"}
              className="px-6 py-1 rounded-lg border-gray4 text-gray3"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveBasicInfo} className="px-6 py-1 bg-appPrimary/80 rounded-lg hover:bg-appPrimary">
              Save
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderAccountInfo = () => {
    const handleCancelAccountInfo = () => {
      setFormData((prev) => ({
        ...prev,
        displayName: user?.displayName || "",
        email: user?.email || ""
      }));
      setIsAccountInfoEditable(false);
    };

    const handleSaveAccountInfo = async () => {
      if (validateAccountInfo()) {
        await updateProfileAPI();
        setIsAccountInfoEditable(false);
      }
    };

    return (
      <div className="">
        <div className="flex space-x-2 items-center">
          <h3 className="text-lg font-semibold">Account Information</h3>
          {!isAccountInfoEditable && (
            <button onClick={() => setIsAccountInfoEditable(true)} className="text-gray-500 hover:text-gray-700">
              <Pencil size={16} />
            </button>
          )}
        </div>
        <div className="flex justify-between mt-">
          <InputField
            label="Display name"
            value={formData.displayName!}
            onChange={handleChange}
            name="displayName"
            disabled={!isAccountInfoEditable}
            placeholder={formData.displayName ? "" : "Your display name..."}
            error={!!errors.displayName}
            errorMessage={errors.displayName}
          />
          <InputField
            label="Email"
            value={formData.email!}
            onChange={handleChange}
            name="email"
            disabled={true}
            placeholder={formData.email ? "" : "Your email..."}
          />
        </div>
        {isAccountInfoEditable && (
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              onClick={handleCancelAccountInfo}
              variant={"outline"}
              className="px-6 py-1 rounded-lg border-gray4 text-gray3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAccountInfo}
              className="px-6 py-1 bg-appPrimary/80 rounded-lg hover:bg-appPrimary"
            >
              Save
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderChangePassword = () => {
    const handleChangePassword = async () => {
      if (validateChangePassword()) {
        updateProfileAPI();
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          retypePassword: ""
        }));
      }
    };

    return (
      <div className="">
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <div className="gap-4">
          <InputField
            label="Current password"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            name="currentPassword"
            disabled={true}
          />
          <div className="flex w-full mt-4 justify-between">
            <InputField
              label="New password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              name="newPassword"
              placeholder="Enter new password..."
              error={!!errors.newPassword}
              errorMessage={errors.newPassword}
            />
            <InputField
              label="Retype password"
              type="password"
              value={formData.retypePassword}
              onChange={handleChange}
              name="retypePassword"
              placeholder="Retype new password..."
              error={!!errors.retypePassword}
              errorMessage={errors.retypePassword}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleChangePassword} className="px-6 py-1 bg-appPrimary/80 rounded-lg hover:bg-appPrimary">
            Change password
          </Button>
        </div>
      </div>
    );
  };

  const renderAvatarModal = () => {
    const handleCancelUploadPhoto = () => {
      setIsModalOpen(false);
    };

    return (
      <div>
        <AvatarModal isOpen={isModalOpen} onClose={handleCancelUploadPhoto} onSave={uploadProfilePhotoAPI} />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg space-y-8">
      {renderUserAvatar()}
      {renderBasicInfo()}
      {renderAccountInfo()}
      {renderChangePassword()}
      {renderAvatarModal()}
    </div>
  );
}

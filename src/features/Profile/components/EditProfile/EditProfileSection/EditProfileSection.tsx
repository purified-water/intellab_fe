import { useState, useEffect } from "react";
import { InputField } from "./InputField";
import { AvatarModal } from "./AvatarModal";
import { useToast } from "@/hooks/use-toast";
import { showToastError, showToastSuccess } from "@/utils/toastUtils";

export function EditProfileSection() {
  const toast = useToast();

  // State cho form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "Purified-water",
    email: "chokokattm@gmail.com",
    currentPassword: "",
    newPassword: "",
    retypePassword: ""
  });

  // State cho avatar
  const [avatar, setAvatar] = useState("https://via.placeholder.com/50"); // URL avatar từ server
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State để kiểm soát chế độ edit (disabled/enabled) cho từng mục
  const [isBasicInfoEditable, setIsBasicInfoEditable] = useState(false);
  const [isAccountInfoEditable, setIsAccountInfoEditable] = useState(false);

  // UserID cố định
  const userId = "Zca23aSmD231a";

  // Gọi API giả lập để lấy dữ liệu (mày thay bằng API thật)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // API giả lập (mày thay bằng fetch thật)
        const response = {
          firstName: "Tuan",
          lastName: "", // Không có dữ liệu, để placeholder
          displayName: "Purified-water",
          email: "chokokattm@gmail.com",
          avatarUrl: "https://via.placeholder.com/50" // URL avatar
        };
        setFormData((prev) => ({
          ...prev,
          firstName: response.firstName || "",
          lastName: response.lastName || "",
          displayName: response.displayName || "",
          email: response.email || ""
        }));
        setAvatar(response.avatarUrl || "https://via.placeholder.com/50");
      } catch (error) {
        showToastError({ toast: toast.toast, message: "Error fetching user data" });
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveAvatar = async (formData: FormData) => {
    try {
      // Gửi FormData lên server (ví dụ dùng fetch)
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        setAvatar(data.avatarUrl); // Cập nhật avatar với URL mới từ server
        setIsModalOpen(false);
        showToastSuccess({ toast: toast.toast, message: "Avatar uploaded successfully" });
      } else {
        showToastError({ toast: toast.toast, message: "Failed to upload avatar" });
      }
    } catch (error) {
      showToastError({ toast: toast.toast, message: "Error uploading avatar" });
    }
  };

  // Xử lý edit Basic Information
  const handleEditBasicInfo = () => {
    setIsBasicInfoEditable(true);
  };

  const handleCancelBasicInfo = () => {
    // Reset về dữ liệu gốc từ API (hoặc state ban đầu)
    setFormData((prev) => ({
      ...prev,
      firstName: "Tuan", // Dữ liệu gốc từ API
      lastName: "" // Dữ liệu gốc
    }));
    setIsBasicInfoEditable(false);
  };

  const handleSaveBasicInfo = async () => {
    try {
      // Gửi dữ liệu lên server (API giả lập)
      const response = await fetch("/api/update-basic-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      });
      if (response.ok) {
        setIsBasicInfoEditable(false);
        showToastSuccess({ toast: toast.toast, message: "Basic information saved successfully" });
      } else {
        showToastError({ toast: toast.toast, message: "Failed to save basic information" });
      }
    } catch (error) {
      showToastError({ toast: toast.toast, message: "Error saving basic information" });
    }
  };

  // Xử lý edit Account Information
  const handleEditAccountInfo = () => {
    setIsAccountInfoEditable(true);
  };

  const handleCancelAccountInfo = () => {
    // Reset về dữ liệu gốc từ API
    setFormData((prev) => ({
      ...prev,
      displayName: "Purified-water", // Dữ liệu gốc
      email: "chokokattm@gmail.com" // Dữ liệu gốc
    }));
    setIsAccountInfoEditable(false);
  };

  const handleSaveAccountInfo = async () => {
    try {
      // Gửi dữ liệu lên server (API giả lập)
      const response = await fetch("/api/update-account-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: formData.displayName,
          email: formData.email
        })
      });
      if (response.ok) {
        showToastSuccess({ toast: toast.toast, message: "Account information saved successfully" });
        setIsAccountInfoEditable(false);
      } else {
        showToastError({ toast: toast.toast, message: "Failed to save account information" });
      }
    } catch (error) {
      showToastError({ toast: toast.toast, message: "Error saving account information" });
    }
  };

  // Xử lý Change Password
  const handleChangePassword = async () => {
    // Validation giống form register
    if (!formData.currentPassword) {
      showToastError({ toast: toast.toast, message: "Please enter current password" });
      return;
    }
    if (!formData.newPassword || formData.newPassword.length < 8) {
      showToastError({ toast: toast.toast, message: "Password must be at least 8 characters" });
      return;
    }
    if (formData.newPassword !== formData.retypePassword) {
      showToastError({ toast: toast.toast, message: "Passwords do not match" });
      return;
    }

    try {
      // Gửi dữ liệu lên server (API giả lập)
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      if (response.ok) {
        showToastSuccess({ toast: toast.toast, message: "Password changed successfully  " });
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          retypePassword: ""
        }));
      } else {
        showToastError({ toast: toast.toast, message: "Failed to change password" });
      }
    } catch (error) {
      showToastError({ toast: toast.toast, message: "Error changing password" });
    }
  };

  // Xử lý copy UserID
  const handleCopyUserId = () => {
    navigator.clipboard
      .writeText(userId)
      .then(() => {
        showToastSuccess({ toast: toast.toast, message: "UserID copied to clipboard" });
      })
      .catch((err) => {
        showToastError({ toast: toast.toast, message: "Failed to copy UserID" });
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="relative group">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4 cursor-pointer"
            onClick={handleAvatarClick}
          />
          {/* <span className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-opacity">
            Edit Avatar
          </span> */}
        </div>
        <span className="text-sm text-gray-500 flex items-center">
          {userId}
          <button onClick={handleCopyUserId} className="ml-2 text-gray-400 hover:text-gray-600" title="Copy UserID">
            📋
          </button>
        </span>
      </div>

      {/* Basic Information */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          {!isBasicInfoEditable && (
            <button onClick={handleEditBasicInfo} className="text-gray-500 hover:text-gray-700">
              ✏️
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <InputField
            label="First name"
            value={formData.firstName}
            onChange={handleChange}
            name="firstName"
            disabled={!isBasicInfoEditable}
            placeholder={formData.firstName ? "" : "Your first name..."}
          />
          <InputField
            label="Last name"
            value={formData.lastName}
            onChange={handleChange}
            name="lastName"
            disabled={!isBasicInfoEditable}
            placeholder={formData.lastName ? "" : "Your last name..."}
          />
        </div>
        {isBasicInfoEditable && (
          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={handleCancelBasicInfo} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={handleSaveBasicInfo}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        )}
        <p className="text-sm text-gray-500 mt-2">
          *Note: Your first and last name will appear inside your course certificates
        </p>
      </div>

      {/* Account Information */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Account Information</h3>
          {!isAccountInfoEditable && (
            <button onClick={handleEditAccountInfo} className="text-gray-500 hover:text-gray-700">
              ✏️
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <InputField
            label="Display name"
            value={formData.displayName}
            onChange={handleChange}
            name="displayName"
            disabled={!isAccountInfoEditable}
            placeholder={formData.displayName ? "" : "Your display name..."}
          />
          <InputField
            label="Email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            disabled={!isAccountInfoEditable}
            placeholder={formData.email ? "" : "Your email..."}
          />
        </div>
        {isAccountInfoEditable && (
          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={handleCancelAccountInfo} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button
              onClick={handleSaveAccountInfo}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Current password"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            name="currentPassword"
            placeholder="Enter current password..."
          />
          <InputField
            label="New password"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            name="newPassword"
            placeholder="Enter new password..."
          />
          <InputField
            label="Retype password"
            type="password"
            value={formData.retypePassword}
            onChange={handleChange}
            name="retypePassword"
            placeholder="Retype new password..."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Change password
          </button>
        </div>
      </div>

      <AvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAvatar}
        currentAvatar={avatar}
      />
    </div>
  );
}

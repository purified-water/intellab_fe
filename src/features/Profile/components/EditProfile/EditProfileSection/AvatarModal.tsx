import React, { useState } from "react";

type AvatarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
  currentAvatar: string | null;
};

export function AvatarModal(props: AvatarModalProps) {
  const { isOpen, onClose, onSave, currentAvatar } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu file được chọn
  const [rotation, setRotation] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || null); // Preview URL (cho cả URL và file mới)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          setPreviewUrl(e.target.result as string); // Cập nhật preview với base64
        }
      };
      reader.readAsDataURL(file);
      setRotation(0); // Reset rotation khi chọn ảnh mới
    }
  };

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(currentAvatar); // Reset về avatar gốc từ URL
    setRotation(0);
  };

  const handleSave = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile); // Thêm file vào FormData với key 'avatar'
      onSave(formData); // Gửi FormData về parent component để xử lý gửi server
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload a New Avatar</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="bg-gray-900 p-4 rounded-md flex items-center justify-center mb-4">
          <div className="relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar Preview"
                className="w-32 h-32 object-cover rounded-md"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            ) : (
              <div className="w-32 h-32 bg-gray-500 flex items-center justify-center text-white">No Image</div>
            )}
            <button
              onClick={() => document.getElementById("avatarInput")?.click()}
              className="absolute bottom-2 right-2 bg-gray-200 p-1 rounded-full hover:bg-gray-300"
            >
              <span className="text-sm">Edit</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <button onClick={handleRotate} className="px-2 py-1 bg-white border rounded hover:bg-gray-100">
            ↺
          </button>
          <button onClick={handleReset} className="px-3 py-1 bg-white border rounded hover:bg-gray-100">
            Reset
          </button>
        </div>

        <input type="file" id="avatarInput" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <label
          htmlFor="avatarInput"
          className="block w-full p-2 bg-gray-100 border rounded cursor-pointer text-center hover:bg-gray-200"
        >
          Choose Image...
        </label>

        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { X, RotateCcw, RotateCw, Save, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";

type AvatarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => Promise<void>;
};

export function AvatarModal({ isOpen, onClose, onSave }: AvatarModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(DEFAULT_AVATAR);

  const toast = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setRotation(0);
      setScale(1);
    }
  };

  const handleRotateClockwise = () => {
    setRotation((prev) => prev + 90);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => prev - 90);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(DEFAULT_AVATAR);
    setRotation(0);
    setScale(1);
  };

  const handleSave = async () => {
    if (selectedFile) {
      await onSave(selectedFile);
      reset();
      onClose();
    } else {
      showToastError({ toast: toast.toast, message: "Please select an image to upload." });
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(DEFAULT_AVATAR);
    setRotation(0);
    setScale(1);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const maxScale = 2;
  const minScale = 0.5;
  const handleScaleChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, minScale), maxScale);
    setScale(clampedValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-[550px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upload a New Avatar</h2>
          <X onClick={handleCancel} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
        </div>

        <div className="bg-gray-900 p-4 rounded-md flex flex-col items-center justify-center mb-4 relative">
          <div className="relative mb-4">
            {previewUrl ? (
              <div className="w-64 h-64 bg-gray5 flex items-center justify-center overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-contain"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    transition: "transform 0.3s ease"
                  }}
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-500 flex items-center justify-center text-white">No Image</div>
            )}
          </div>
          <div className="flex space-x-2">
            <RotateCcw
              onClick={handleRotateClockwise}
              className="px-2 py-1 bg-white border border-gray-300 text-black font-bold rounded hover:bg-gray-100 cursor-pointer"
              size={40}
            />
            <RotateCw
              onClick={handleRotateCounterClockwise}
              className="px-2 py-1 bg-white border border-gray-300 text-black font-bold rounded hover:bg-gray-100 cursor-pointer"
              size={40}
            />
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="range"
            min={minScale}
            max={maxScale}
            step="0.1"
            value={scale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-500">Scale: {scale.toFixed(1)}x</span>
        </div>

        <div className="justify-items-center">
          <input type="file" id="avatarInput" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <label
            htmlFor="avatarInput"
            className="flex justify-center items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-center hover:bg-gray-200"
          >
            <FileImage size={16} className="mr-2" />
            Choose Image...
          </label>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 text-blue-400 font-bold"
          >
            <Save size={16} className="mr-2" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 border border-gray-300 rounded hover:bg-gray-300 text-blue-400 font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

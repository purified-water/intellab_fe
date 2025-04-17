import React, { useState, useRef } from "react";
import DEFAULT_AVATAR from "@/assets/default_avatar.png";
import { X, RotateCcw, RotateCw, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showToastError } from "@/utils/toastUtils";
import { Button } from "@/components/ui";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    if (selectedFile && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = previewUrl!;
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(scale, scale);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();

          canvas.toBlob(async (blob) => {
            if (blob) {
              const transformedFile = new File([blob], selectedFile.name, { type: selectedFile.type });
              await onSave(transformedFile);
              reset();
              onClose();
            }
          }, selectedFile.type);
        };
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-[550px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Upload a New Avatar</h2>
          <X onClick={handleCancel} className="text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>

        <div className="relative flex flex-col items-center justify-center p-4 mb-4 bg-gray-900 rounded-md">
          <div className="relative mb-4">
            {previewUrl ? (
              <div className="flex items-center justify-center w-64 h-64 overflow-hidden rounded-full bg-gray5">
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="object-contain w-full h-full"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${scale})`,
                    transition: "transform 0.3s ease"
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-64 h-64 text-white bg-gray-500">No Image</div>
            )}
          </div>
          <div className="flex space-x-2">
            <RotateCcw
              onClick={handleRotateClockwise}
              className="px-2 py-1 font-bold text-black bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
              size={40}
            />
            <RotateCw
              onClick={handleRotateCounterClockwise}
              className="px-2 py-1 font-bold text-black bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
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
            className="flex items-center justify-center px-3 py-2 text-center border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
          >
            <FileImage size={16} className="mr-2" />
            Choose Image...
          </label>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            onClick={handleCancel}
            variant={"outline"}
            className="px-6 py-1 rounded-lg border-gray3 text-gray1 hover:opacity-80"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6 py-1 rounded-lg bg-appPrimary hover:bg-appPrimary/80">
            Save
          </Button>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}

import React, { useState, useRef } from "react";
import { useFilePreview } from "@/hooks";
import { Button } from "./Button";

interface FilePreviewExampleProps {
  defaultImage?: string;
  className?: string;
  onFileSelected?: (file: File) => void;
  acceptedFileTypes?: string;
}

export function FilePreviewExample({
  defaultImage,
  className = "",
  onFileSelected,
  acceptedFileTypes = "image/*"
}: FilePreviewExampleProps) {
  const [file, setFile] = useState<File | string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = useFilePreview(file);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileSelected) {
        onFileSelected(selectedFile);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex items-center justify-center w-64 h-64 overflow-hidden border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
        {preview ? (
          <img 
            src={preview} 
            alt="File Preview" 
            className="object-contain max-w-full max-h-full"
          />
        ) : (
          <span className="text-gray-400">No file selected</span>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" onClick={handleClick} variant="outline">
          Select File
        </Button>
        {preview && (
          <Button type="button" onClick={handleReset} variant="outline">
            Clear
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

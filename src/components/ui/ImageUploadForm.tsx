import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui";
import { CREATE_COURSE_THUMBNAIL_MAX_SIZE } from "@/constants";

interface ImageUploadProps {
  value: string | null; // base64 string
  onChange: (base64: string | null) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const ImageUploadForm = ({ value, onChange }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= CREATE_COURSE_THUMBNAIL_MAX_SIZE) {
      const base64 = await fileToBase64(file);
      onChange(base64);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= CREATE_COURSE_THUMBNAIL_MAX_SIZE) {
      const base64 = await fileToBase64(droppedFile);
      onChange(base64);
    }
  };

  const removeFile = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-full max-w-md">
          <img
            src={value}
            alt="Preview"
            className="object-cover w-full h-auto rounded-md"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={removeFile}
            className="absolute rounded-full top-1 right-1 bg-white/80 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="p-6 text-center border border-dashed rounded-md cursor-pointer hover:bg-muted/50"
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <span className="underline text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray3">{`Max. File Size: ${CREATE_COURSE_THUMBNAIL_MAX_SIZE / (1024 * 1024)}MB`}</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputRef}
            onChange={handleUpload}
          />
        </div>
      )}
    </div>
  );
};

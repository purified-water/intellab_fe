import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui";
import { CREATE_COURSE_THUMBNAIL_MAX_SIZE } from "@/constants";

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export const ImageUploadForm = ({ value, onChange }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= CREATE_COURSE_THUMBNAIL_MAX_SIZE) {
      onChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= CREATE_COURSE_THUMBNAIL_MAX_SIZE) {
      onChange(droppedFile);
    }
  };

  const removeFile = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {preview ? (
        <div className="relative w-[400px] h-[200px]">
          <img src={preview} alt="Preview" className="object-cover w-full h-full rounded-md" />
          <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="absolute rounded-full top-1 right-1 bg-white/80 hover:bg-white">
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
            <p className="text-xs text-gray3">Image dimensions should be 400px x 200px</p>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={inputRef} onChange={handleUpload} />
        </div>
      )}
    </div>
  );
};

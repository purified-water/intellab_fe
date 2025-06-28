import { Textarea } from "@/components/ui/shadcn";
import { useState } from "react";
import { RenderMarkdown } from "@/components/Markdown";
import { useMarkdownImageUpload } from "../features/course/hooks";

interface AddMarkdownContentProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  allowImage?: boolean;
  placeholder?: string;
}

export const AddMarkdownContent = ({
  value,
  onChange,
  readOnly = false,
  allowImage = false,
  placeholder = "Start typing... You can also drag and drop images here!"
}: AddMarkdownContentProps) => {
  const [isEditing, setIsEditing] = useState(true);

  // Initialize the image upload hook
  const imageUpload = useMarkdownImageUpload(value, onChange, readOnly);

  // Render the edit/preview toggle buttons
  const renderButtonRow = () => (
    <div className="flex gap-2 p-1 text-xs font-medium rounded-lg bg-appPrimary">
      <button
        type="button"
        className={`px-3 py-2 rounded transition-colors duration-300 ${
          isEditing ? "bg-white text-black" : "text-white"
        }`}
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
      <button
        type="button"
        className={`px-3 py-2 rounded transition-colors duration-300 ${
          !isEditing ? "bg-white text-black" : "text-white"
        }`}
        onClick={() => setIsEditing(false)}
      >
        Preview
      </button>
    </div>
  );

  // Render the main content area (textarea or preview)
  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="relative">
          <Textarea
            ref={imageUpload.textareaRef}
            className="w-full h-[600px] p-2 border rounded-lg max-h-[2000px] resize-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            placeholder={placeholder}
          />

          {/* Drag overlay - only shown when dragging over the textarea */}
          {allowImage && imageUpload.isDragging && (
            <div className="absolute inset-0 z-10 flex items-center justify-center border-2 border-purple-800 border-dashed rounded-lg pointer-events-none bg-appPramary/10">
              <div className="px-6 py-3 text-lg font-medium bg-white rounded-lg shadow-md text-appPrimary">
                Drop image(s) here to upload
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full h-[600px] p-2 border rounded-lg max-h-[2000px] overflow-auto">
        <RenderMarkdown content={value} />
      </div>
    );
  };

  // Status message based on current state
  const getStatusMessage = () => {
    if (!allowImage) return "Image upload disabled";
    if (readOnly) return "Read-only mode";
    if (imageUpload.isUploading) return `Uploading ${imageUpload.uploadingCount} image(s)...`;
    return "Drag & drop images to upload, or click to type";
  };

  return (
    <div
      className="relative flex flex-col"
      // Apply dropzone props to the container when image upload is allowed
      {...(allowImage && !readOnly ? imageUpload.getRootProps() : {})}
    >
      {/* Hidden file input for dropzone */}
      {allowImage && !readOnly && <input {...imageUpload.getInputProps()} />}

      <div className="flex items-center mb-4 space-x-4">
        {renderButtonRow()}
        <div className={`text-sm ${imageUpload.isUploading ? "text-appPrimary font-medium" : "text-gray3"}`}>
          {getStatusMessage()}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

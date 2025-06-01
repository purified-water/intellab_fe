import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { adminCourseAPI } from "@/features/Admins/api";

// Custom hook for handling image uploads in markdown
export const useMarkdownImageUpload = (value: string, onChange: (val: string) => void, readOnly?: boolean) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());

  // Use a ref to always have access to the current value
  const currentValueRef = useRef(value);

  // Update ref whenever value changes
  useEffect(() => {
    currentValueRef.current = value;
  }, [value]);

  // Mutation for uploading individual images
  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageId, file }: { imageId: string; file: File }) => {
      const data = await adminCourseAPI.postLessonImageInMarkdown(imageId, file);
      if (!data) throw new Error("Image upload failed");

      return { imageId, url: data };
    }
  });

  // Generate a placeholder text for uploading images
  const generatePlaceholder = (filename: string, imageId: string) => {
    return `![Uploading ${filename}...](uploading-${imageId})`;
  };

  // Handle dropping files
  const onDrop = async (files: File[]) => {
    if (!files.length || readOnly) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Get cursor position or default to end
    const cursorPosition = textarea.selectionStart ?? value.length;
    const imageIds = new Set<string>();

    // Create placeholders for all images immediately
    const placeholders = files.map((file) => {
      const imageId = uuidv4();
      imageIds.add(imageId);
      return generatePlaceholder(file.name, imageId);
    });

    // Update uploading state
    setUploadingImages((prev) => new Set([...prev, ...imageIds]));

    // Insert placeholders immediately
    const placeholderText = placeholders.join("\n");
    const newValue =
      value.slice(0, cursorPosition) +
      (cursorPosition > 0 && value[cursorPosition - 1] !== "\n" ? "\n" : "") +
      placeholderText +
      "\n" +
      value.slice(cursorPosition);

    onChange(newValue);

    // Upload images and replace placeholders as they complete
    files.forEach(async (file, index) => {
      const imageId = Array.from(imageIds)[index];
      const placeholder = placeholders[index];

      try {
        const result = await uploadImageMutation.mutateAsync({ imageId, file });

        // FIXED: Use the ref to get the current value instead of stale closure
        const currentValue = currentValueRef.current;

        // Replace placeholder with actual image markdown
        const imageMarkdown = `![${file.name}](${result.url})`;

        // Check if placeholder still exists before replacing
        if (currentValue.includes(placeholder)) {
          const updatedValue = currentValue.replace(placeholder, imageMarkdown);
          onChange(updatedValue);
        } else {
          console.warn(`Placeholder not found: ${placeholder}`);
        }
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);

        // Replace placeholder with error message
        const errorMarkdown = `![Failed to upload ${file.name}](error)`;

        // FIXED: Use the ref to get current value
        const currentValue = currentValueRef.current;
        if (currentValue.includes(placeholder)) {
          const updatedValue = currentValue.replace(placeholder, errorMarkdown);
          onChange(updatedValue);
        } else {
          console.warn(`Placeholder not found for error: ${placeholder}`);
        }
      } finally {
        // Remove from uploading set
        setUploadingImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    });
  };

  // Configure dropzone
  const dropzone = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]
    },
    noClick: true, // Prevent clicking on container from opening file dialog
    noKeyboard: true,
    disabled: readOnly,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: (e) => {
      // Only hide drag state if we're leaving the dropzone entirely
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    },
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false)
  });

  // Reset drag state when component unmounts or readOnly changes
  useEffect(() => {
    if (readOnly) {
      setIsDragging(false);
    }
  }, [readOnly]);

  return {
    textareaRef,
    isDragging,
    isUploading: uploadingImages.size > 0,
    uploadingCount: uploadingImages.size,
    getRootProps: dropzone.getRootProps,
    getInputProps: dropzone.getInputProps
  };
};

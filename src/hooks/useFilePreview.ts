import { useState, useEffect } from 'react';

/**
 * A custom hook that generates a preview URL for a file or image path.
 * 
 * @param file - The file object or string URL to generate a preview for
 * @returns A string URL that can be used as the source of an image tag, or null if no preview is available
 */
export const useFilePreview = (file: File | string | null) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // Clean up the previous preview URL to prevent memory leaks
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    if (!file) {
      setPreview(null);
      return;
    }

    // If file is already a string URL, use it directly
    if (typeof file === 'string') {
      setPreview(file);
      return;
    }

    // If file is a File object, create a preview using FileReader
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
        setPreview(null);
      };
      reader.readAsDataURL(file);
    }

    // Clean up function
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  return preview;
};
const UNAVAILABLE_IMAGE = new URL("@/assets/unavailable_image.jpg", import.meta.url).href;

const imageURLToFile = async (url: string, fileName = "thumbnail.png"): Promise<File> => {
  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.blob();
    const mimeType = data.type || "image/png";
    return new File([data], fileName, { type: mimeType });
  } catch (error) {
    console.error("--> Error fetching course image:", error);

    const fallbackResponse = await fetch(UNAVAILABLE_IMAGE, { cache: "no-store" });
    if (!fallbackResponse.ok) {
      console.error("--> Error fetching fallback image:", fallbackResponse.statusText);
      throw new Error("Failed to fetch fallback image");
    }
    const fallbackData = await fallbackResponse.blob();
    const mimeType = fallbackData.type || "image/png";
    return new File([fallbackData], fileName, { type: mimeType });
  }
};

export { imageURLToFile };

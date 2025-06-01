const imageURLToFile = async (url: string, fileName = "thumbnail.png"): Promise<File> => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const data = await response.blob();
  const mimeType = data.type || "image/png";
  return new File([data], fileName, { type: mimeType });
};

export { imageURLToFile };

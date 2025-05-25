const imageURLToFile = async (url: string, fileName = "thumbnail.png"): Promise<File> => {
  const bustUrl = url + (url.includes("?") ? "&" : "?") + "cb=" + Date.now();
  const response = await fetch(bustUrl, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const data = await response.blob();
  const mimeType = data.type || "image/png";
  const result = new File([data], fileName, { type: mimeType });
  return result;
};

export { imageURLToFile };

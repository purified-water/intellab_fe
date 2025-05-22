const imageURLToFile = async (url: string, fileName = "thumbnail.png"): Promise<File> => {
  const response = await fetch(url);
  const data = await response.blob();
  const mimeType = data.type || "image/png";
  return new File([data], fileName, { type: mimeType });
};

export { imageURLToFile };

import axios from "axios";

const BASE_URL = "http://localhost:8000";

const getSummaryContent = async (courseName: string, courseId: string, regenereate: "true" | "false") => {
  const bodyParams = {
    message: `course name: ${courseName}, id: ${courseId}, regenerate: ${regenereate}`,
    modal: "groq-llama-3.3-70b"
  };
  const response = await axios.post(`${BASE_URL}/summarize-assistant/invoke`, bodyParams);
  return response.data;
};

const getPDFSummaryFile = async () => {
  const response = await axios.get(`${BASE_URL}/pdf-summarization`, {
    responseType: "arraybuffer" // Important for binary data like PDFs
  });
  return response;
};

export const aiAPI = {
  getSummaryContent,
  getPDFSummaryFile
};

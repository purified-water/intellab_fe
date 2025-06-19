import { TTestCaseFileContent } from "../types";

export const readFileContent = async (file: File): Promise<TTestCaseFileContent> => {
  const text = await file.text();
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2 || lines[0].toLowerCase() !== "input" || lines[lines.length - 2].toLowerCase() !== "output") {
    throw new Error("Invalid file format. Ensure the file starts with 'input' and ends with 'output'.");
  }

  const inputLines = lines.slice(1, -2);
  const outputLine = lines[lines.length - 1];

  return {
    input: inputLines.join("\n"),
    output: outputLine
  };
};

export const readFolderContent = async (files: File[]): Promise<TTestCaseFileContent[]> => {
  const results: TTestCaseFileContent[] = [];

  for (const file of files) {
    try {
      const content = await readFileContent(file);
      results.push(content);
    } catch (error) {
      console.error(`Error reading file ${file.name}:`, error);
    }
  }

  return results;
};

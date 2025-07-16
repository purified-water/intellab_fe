import { TTestCaseFileContent } from "../types";

export const readFileContent = async (file: File): Promise<TTestCaseFileContent> => {
  const text = await file.text();
  const lines = text.split("\n").map((line) => line.trim());
  if (
    lines.length < 2 ||
    lines[0].toLowerCase() !== "input" ||
    !text.includes("output") ||
    lines[lines.length - 1] === "output"
  ) {
    throw new Error("Invalid file format. Ensure the file starts with 'input' and ends with 'output'.");
  }

  const inputLines: string[] = [];
  const outputLines: string[] = [];
  let index = 1;
  for (index; index < lines.length; index++) {
    if (lines[index].toLowerCase() === "output") {
      break;
    }
    inputLines.push(lines[index]);
  }

  index++;
  for (index; index < lines.length; index++) {
    outputLines.push(lines[index]);
  }

  return {
    input: inputLines.join("\n"),
    output: outputLines.join("\n")
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

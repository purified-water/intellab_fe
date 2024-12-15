import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { LanguageSupport } from "@codemirror/language";

export enum SupportedLanguages {
  Javascript = "Javascript",
  Python = "Python",
  Java = "Java",
  CPlusPlus = "C++"
}

export const languageExtensions: Record<SupportedLanguages, LanguageSupport> = {
  [SupportedLanguages.Javascript]: javascript(),
  [SupportedLanguages.Python]: python(),
  [SupportedLanguages.Java]: java(),
  [SupportedLanguages.CPlusPlus]: cpp()
};

export interface LanguageCodeType {
  id: number;
  name: string;
  is_archived: boolean;
}

export interface BoilerplateType {
  languageId: number;
  code: string;
  longName: string;
  shortName: string;
}

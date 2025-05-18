export interface TestcaseAction {
  type: "create" | "view" | "edit" | "delete" | "default";
  testcaseId?: string;
}

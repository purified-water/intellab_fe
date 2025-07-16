export const BoilerplateDataTypes = [
  "int",
  "float",
  "string",
  "bool",
  "list<int>",
  "list<float>",
  "list<string>",
  "list<bool>",
  "list<list<int>>",
  "list<list<float>>",
  "list<list<string>>",
  "list<list<bool>>"
] as const;
// Use number to represent the index of the array and define the type of any element in the array
export type BoilerplateDataType = (typeof BoilerplateDataTypes)[number];

import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn";
import { BoilerplateDataType, BoilerplateDataTypes } from "../../../constants/BoilerplateDataTypes";
import { Button } from "@/components/ui";

interface BoilerplateDataItemProps {
  mode: "input" | "output";
  dataType: BoilerplateDataType;
  dataName: string;
  onDatatypeChange: (value: BoilerplateDataType) => void;
  onNameChange: (value: string) => void;
  onRemove: () => void;
}

export const BoilerplateDataItem = ({
  mode,
  dataType,
  dataName,
  onDatatypeChange,
  onNameChange,
  onRemove
}: BoilerplateDataItemProps) => {
  return (
    <div className="flex items-center gap-2 p-2 text-sm rounded-lg bg-gray6/40">
      <Select onValueChange={onDatatypeChange} defaultValue={dataType}>
        <span className="mr-2">Datatype: </span>
        <SelectTrigger className="min-w-[120px]">
          <SelectValue placeholder="Select course level" />
        </SelectTrigger>
        <SelectContent className="min-w-[120px]">
          {BoilerplateDataTypes.map((dataType: BoilerplateDataType) => (
            <SelectItem key={dataType} value={dataType}>
              {dataType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="inline-block ml-2 whitespace-nowrap">{mode === "input" ? "Input" : "Output"} name:</span>
      <Input
        className="ml-2"
        value={dataName}
        onChange={(e) => onNameChange(e.target.value)}
        disabled={mode == "output"}
      />

      {mode == "input" ? (
        <Button type="button" variant="ghost" onClick={onRemove} className="text-sm text-gray3">
          ✕
        </Button>
      ) : (
        <div className="w-7" />
      )}
    </div>
  );
};

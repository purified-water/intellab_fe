import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui";
import { BoilerplateDataItem } from "./BoilerplateDataItem";
import { BoilerplateDataTypes, BoilerplateDataType } from "../../../constants/BoilerplateDataTypes";

interface BoilerplateDataItemProps {
  namePrefix: `problemStructure.${"inputStructure" | "outputStructure"}`;
  mode: "input" | "output";
}

export const BoilerplateDataItemList = ({ namePrefix, mode }: BoilerplateDataItemProps) => {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: namePrefix });

  const values = watch(namePrefix);

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <BoilerplateDataItem
            mode={mode}
            dataType={values?.[index]?.[`${mode}Type`] || "string"}
            dataName={values?.[index]?.[`${mode}Name`] || ""}
            onDatatypeChange={(value: BoilerplateDataType) => setValue(`${namePrefix}.${index}.${mode}Type`, value)}
            onNameChange={(value: string) => setValue(`${namePrefix}.${index}.${mode}Name`, value)}
            onRemove={() => remove(index)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ [`${mode}Name`]: "", [`${mode}Type`]: BoilerplateDataTypes[0] })}
        className="mt-2"
      >
        + Add
      </Button>
    </div>
  );
};

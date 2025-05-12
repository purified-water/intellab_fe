import { Card, CardContent, Label, RadioGroup, RadioGroupItem } from "@/components/ui/shadcn";
import { unavailableImage } from "@/assets";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { useCreateFinalStep } from "../../../hooks";
import { useEffect } from "react";
import { Spinner } from "@/components/ui";

type Template = {
  id: string;
  name: string;
};

const templateList: Template[] = [
  {
    id: "1",
    name: "Template 1"
  },
  {
    id: "2",
    name: "Template 2"
  }
];

type Props = {
  value: number;
  onChange: (value: string) => void;
};

export const AddCertificateTemplate = ({ value, onChange }: Props) => {
  const courseId = useSelector((state: RootState) => state.createCourse.courseId);
  const selectedTemplate = templateList.find((t) => t.id === value.toString());

  const createCourseFinalStep = useCreateFinalStep(courseId, Number(selectedTemplate?.id) || 0);
  const { data: templateData, isLoading, refetch } = createCourseFinalStep.getCertificateTemplates;

  useEffect(() => {
    if (selectedTemplate) {
      refetch();
    }
  }, [selectedTemplate, refetch]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      <div className="space-y-4 md:col-span-2">
        <RadioGroup value={value.toString()} onValueChange={onChange} className="space-y-2">
          {templateList.map((template) => (
            <Card
              key={template.id}
              className={`shadow-none w-56 rounded-lg p-3 border ${
                value.toString() === template.id ? "border" : "hover:bg-muted"
              }`}
            >
              <Label className="flex items-center gap-3 cursor-pointer">
                <RadioGroupItem value={template.id} />
                {template.name}
              </Label>
            </Card>
          ))}
        </RadioGroup>
      </div>

      {/* Preview */}
      <div className="md:col-span-3 ">
        {isLoading && (
          <div className="flex items-center justify-center w-full h-56">
            <Spinner loading={isLoading} className="flex items-center justify-center size-full" />
          </div>
        )}
        {selectedTemplate && !isLoading && (
          <Card className="rounded-lg shadow-none">
            <CardContent className="p-2">
              <img
                src={templateData || unavailableImage}
                alt={selectedTemplate.name}
                className="object-cover w-full h-auto"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

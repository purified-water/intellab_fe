import { Card, CardContent, Label, RadioGroup, RadioGroupItem } from "@/components/ui/shadcn";
import { unavailableImage } from "@/assets";

type Template = {
  id: string;
  name: string;
  imageUrl: string;
};

const mockTemplates: Template[] = [
  {
    id: "template1",
    name: "Template 1",
    imageUrl: unavailableImage
  },
  {
    id: "template2",
    name: "Template 2",
    imageUrl: unavailableImage
  },
  {
    id: "template3",
    name: "Template 3",
    imageUrl: unavailableImage
  }
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const AddCertificateTemplate = ({ value, onChange }: Props) => {
  const selectedTemplate = mockTemplates.find((t) => t.id === value);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
      <div className="space-y-4 md:col-span-2">
        <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
          {mockTemplates.map((template) => (
            <Card
              key={template.id}
              className={`shadow-none w-56 rounded-lg p-3 border ${
                value === template.id ? "border-" : "hover:bg-muted"
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
        {selectedTemplate && (
          <Card className="rounded-lg shadow-none">
            <CardContent className="p-2">
              <img src={selectedTemplate.imageUrl} alt={selectedTemplate.name} className="object-cover w-full h-auto" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Button } from "@/components/ui";

export const QuickReferenceGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  const FORMATS = [
    {
      title: "List Format",
      example: "4\n 1 2 3 4"
    },
    {
      title: "Number (int/float) Format",
      example: "42"
    },
    {
      title: "String Format",
      example: '"Hello World"'
    }
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between py-2 px-2 h-auto text-xs font-normal text-gray2">
          Quick Reference Guide
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FORMATS.map((format, index) => (
            <div key={index} className="rounded-lg p-3 border space-y-2">
              <h3 className="text-black1 text-xs">{format.title}</h3>
              <div className="bg-gray8 p-2 text-xs rounded-lg">
                {format.example.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < format.example.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

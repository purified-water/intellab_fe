import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/shadcn";
import { Button } from "@/components/ui";
import { File, Files } from "lucide-react";
import { LessonAction } from "../../../types";

interface AddLessonModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onAddLesson?: (action: LessonAction) => void;
}

export function AddLessonModal({ open, onOpenChange, onAddLesson }: AddLessonModalProps) {
  const handleCreateLesson = (type: string) => {
    if (onAddLesson) {
      onAddLesson({
        type: type === "add-blank" ? "add-blank" : "add-clone",
        lessonId: ""
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center px-4 py-8">
        <DialogHeader className="text-center">
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <DialogDescription>Select an option to create a new lesson.</DialogDescription>

        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={() => handleCreateLesson("add-blank")}
            variant="outline"
            className="flex flex-col border-dashed opacity-50 size-56 hover:opacity-100"
          >
            <File className="mr-2 size-4" />
            Create Blank Lesson
          </Button>

          <Button
            onClick={() => handleCreateLesson("add-clone")}
            variant="outline"
            className="flex flex-col border-dashed opacity-50 size-56 hover:opacity-100"
          >
            <Files className="mr-2 size-4" />
            Create From Existing Lesson
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

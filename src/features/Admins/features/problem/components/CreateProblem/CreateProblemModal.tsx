import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/shadcn";
import { Button } from "@/components/ui";
import { File, Files } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetCreateProblem } from "@/redux/createProblem/createProblemSlice";
import { adminProblemAPI } from "@/features/Admins/api";
import { useToast } from "@/hooks";
import { showToastSuccess, showToastError } from "@/utils";
import { Spinner } from "@/components/ui";
import _ from "lodash";

interface CreateProblemModalProps {
  open: boolean;
  onClose: () => void;
  onImportProblemSuccess: () => void;
}

export function CreateProblemModal({ open, onClose, onImportProblemSuccess }: CreateProblemModalProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateBlankProblem = () => {
    dispatch(resetCreateProblem());
    navigate("/admin/problems/create/general");
  };

  const handleImportProblemFromPolygon = async () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const zipFiles = fileArray.filter((file) => file.type === "application/zip" || file.name.endsWith(".zip"));
      if (_.isEmpty(zipFiles)) {
        alert("Please select at least one ZIP file.");
        return;
      }

      if (zipFiles.length !== fileArray.length) {
        alert(`${fileArray.length - zipFiles.length} non-ZIP files were ignored. Only ZIP files will be processed.`);
      }

      setLoading(true);

      for (let i = 0; i < zipFiles.length; i++) {
        const file = zipFiles[i];
        await adminProblemAPI.importProblemFromPolygon({
          body: { file: file },
          onSuccess: async () => {
            showToastSuccess({
              toast,
              title: `File ${i + 1}/${zipFiles.length} Imported Successfully`,
              message: `${file.name} imported successfully`
            });
          },
          onFail: async (error) => {
            showToastError({
              toast,
              title: `File ${i + 1}/${zipFiles.length} Import Failed`,
              message: `Error importing ${file.name}: ${error}`
            });
          }
        });
      }

      setLoading(false);
      onImportProblemSuccess();
    }
    event.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center px-4 py-8">
        <DialogHeader className="text-center">
          <DialogTitle>Create A New Problem</DialogTitle>
        </DialogHeader>
        <DialogDescription>Select an option to create a new problem.</DialogDescription>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <div className="flex items-center justify-between gap-4">
          <Button
            disabled={loading}
            onClick={handleCreateBlankProblem}
            variant="outline"
            className="flex flex-col border-dashed opacity-50 size-56 hover:opacity-100"
          >
            <File className="mr-2 size-4" />
            Create A Blank Problem
          </Button>

          <Button
            disabled={loading}
            onClick={handleImportProblemFromPolygon}
            variant="outline"
            className="flex flex-col text-center border-dashed opacity-50 size-56 hover:opacity-100"
          >
            {loading ? (
              <>
                <Spinner className="w-6 h-6" loading={loading} />
                Importing problems
              </>
            ) : (
              <>
                <Files className="mr-2 size-4" />
                Import Problems From Polygon
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

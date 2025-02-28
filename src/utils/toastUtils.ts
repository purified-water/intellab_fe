import { toast } from "@/hooks/use-toast";

type TParameters = {
  toast: typeof toast;
  title?: string;
  message: string;
};

const showToastDefault = ({ toast, title = "Notification", message }: TParameters) => {
  toast({
    title: title,
    description: message
  });
};

const showToastSuccess = ({ toast, title = "Success", message }: TParameters) => {
  toast({
    title: title,
    description: message
  });
};

const showToastError = ({ toast, title = "Error", message }: TParameters) => {
  toast({
    title: title,
    description: message,
    variant: "destructive"
  });
};

export { showToastDefault, showToastSuccess, showToastError };

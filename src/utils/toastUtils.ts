import { toast } from "@/hooks/use-toast";

const DEFAULT_DURATION = 2000;

type TParameters = {
  toast: typeof toast;
  title?: string;
  message: React.ReactNode; // allow JSX elements
  duration?: number;
};

const showToastDefault = ({ toast, title = "Notification", message, duration = DEFAULT_DURATION }: TParameters) => {
  toast({
    title: title,
    description: message,
    duration: duration
  });
};

const showToastSuccess = ({ toast, title = "Success", message, duration = DEFAULT_DURATION }: TParameters) => {
  toast({
    title: title,
    description: message,
    duration: duration
  });
};

const showToastError = ({ toast, title = "Error", message, duration = DEFAULT_DURATION }: TParameters) => {
  toast({
    title: title,
    description: message,
    variant: "destructive",
    duration: duration
  });
};

export { showToastDefault, showToastSuccess, showToastError };

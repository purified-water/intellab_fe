import {
  AlertDialog as ShadCNAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog"

type AlertDialogProps = {
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  children?: React.ReactNode
  open?: boolean,
  processing?: boolean
}


export function AlertDialog(props: AlertDialogProps) {
  const { title, message, onConfirm, onCancel, children, open, processing } = props

  return (
    <ShadCNAlertDialog open={open}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={processing}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-appPrimary hover:bg-appPrimary/80" onClick={onConfirm} disabled={processing}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadCNAlertDialog>

  )
}

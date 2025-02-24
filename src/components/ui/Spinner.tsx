import { ClipLoader } from "react-spinners";

type SpinnerProps = {
  loading: boolean;
  overlay?: boolean;
}

export default function Spinner(props: SpinnerProps) {
  const { loading, overlay = false } = props;

  const renderSpinner = () => {
    return (
      <ClipLoader
        color="#5a3295"
        loading={loading}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    )
  };

  let content = (
    <div className="flex flex-col items-center justify-center">
      {renderSpinner()}
    </div>
  )

  if (overlay) {
    content = (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 bg-gray3">
        <div className="flex flex-col items-center justify-center rounded-lg size-40">
          {renderSpinner()}
        </div>
      </div>
    )
  }

  return loading && content;
}
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
        size={70}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    )
  };

  let content = (
    <div className="items-center justify-center flex flex-col">
      {renderSpinner()}
    </div>
  )

  if (overlay) {
    content = (
      <div className="fixed inset-0 bg-gray3 bg-opacity-50 flex items-center justify-center">
        <div className="size-40 bg-white rounded-lg items-center justify-center flex flex-col">
          {renderSpinner()}
        </div>
      </div>
    )
  }

  return loading && content;
}
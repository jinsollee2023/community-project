import { Button } from "./button";
import { FallbackProps } from "react-error-boundary";
import { BiSolidError } from "react-icons/bi";

interface CustomFallbackProps extends FallbackProps {
  customMessage: string;
}

const FallbackUI = ({
  error,
  resetErrorBoundary,
  customMessage,
}: CustomFallbackProps) => {
  console.log(error);
  return (
    <div className="p-32 flex flex-col items-center space-y-6 rounded-md bg-red-50">
      <div className="flex items-center space-x-1">
        <BiSolidError size={20} />
        <p>{customMessage}</p>
      </div>
      <Button onClick={resetErrorBoundary} size="sm">
        다시 시도하기
      </Button>
    </div>
  );
};

export default FallbackUI;

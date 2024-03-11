import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import FadeLoader from "react-spinners/FadeLoader";

interface LoadingSpinnerProps {
  isLoading?: boolean;
  text: string;
}

const LoadingSpinner = ({ isLoading, text }: LoadingSpinnerProps) => {
  return (
    <AlertDialog open={isLoading}>
      <AlertDialogContent>
        <div className="p-8 flex flex-col justify-center items-center space-y-4">
          <FadeLoader
            color="gray"
            height={15}
            width={5}
            radius={2}
            margin={2}
          />
          <p>{text}</p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoadingSpinner;

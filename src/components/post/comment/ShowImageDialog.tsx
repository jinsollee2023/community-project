import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { HiOutlineXMark } from "react-icons/hi2";

interface ShowImageDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  image: string;
}

const ShowImageDialog = ({
  isOpen,
  setIsOpen,
  image,
}: ShowImageDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="p-3">
        <div className="flex justify-center relative">
          <img src={image} className="rounded-sm" />
          <Button
            size="mini"
            variant="secondary"
            className="absolute top-1 right-1"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineXMark size={25} />
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShowImageDialog;

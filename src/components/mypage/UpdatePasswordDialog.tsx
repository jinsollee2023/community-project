import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "../ui/use-toast";

interface UpdatePasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  email: string;
}

const UpdatePasswordDialog = ({
  isOpen,
  setIsOpen,
  email,
}: UpdatePasswordDialogProps) => {
  const { toast } = useToast();

  const onClickSendPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        variant: "green",
        title: "가입하신 이메일로 재설정 메일이 전송되었습니다.",
        duration: 2000,
      });
      setIsOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
        duration: 1000,
      });
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="pb-4">
          <AlertDialogTitle>비밀번호를 변경하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            가입하신 email로 비밀번호 재설정 메일을 보내드립니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onClickSendPassword}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdatePasswordDialog;

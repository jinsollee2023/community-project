import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProfileForm from "./ProfileForm";
import { useDialog } from "@/store/DialogContext";

const ProfileFormDialog = () => {
  const { isOpen } = useDialog();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로필 수정</AlertDialogTitle>
        </AlertDialogHeader>
        <ProfileForm />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProfileFormDialog;

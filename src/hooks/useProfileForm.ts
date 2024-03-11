import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { profileFormSchema } from "@/shared/form/formValidation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { IUser } from "@/types/types";
import { getKoreaTimeDate } from "@/shared/form/common";
import useUserMutations from "./queries/user/useUserMutations";
import useUserQueries from "./queries/user/useUserQueries";
import { useNavigate } from "react-router-dom";
import { useDialog } from "@/store/DialogContext";
import { storageAPI } from "@/lib/api/storageAPI";

const useProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const { setIsOpen } = useDialog();
  const { toast } = useToast();
  const { addUserMutation, updateUserMutation } = useUserMutations();
  const navigate = useNavigate();

  onAuthStateChanged(auth, () => {});
  const user = auth.currentUser;
  const userId = auth.currentUser?.uid || localStorage.getItem("userId");

  const { userData } = useUserQueries({
    userId: userId as string,
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    const setFormValues = async () => {
      setIsLoading(true);

      const imageURL = userData ? userData.profileImage : user?.photoURL;
      setProfileImage(imageURL);

      profileForm.setValue(
        "name",
        userData ? userData.nickname : user?.displayName
      );
      profileForm.setValue("bio", userData ? userData.bio : "");
      profileForm.setValue("image", imageURL);

      setIsLoading(false);
    };
    setFormValues();
  }, []);

  const imageOnChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File) => void
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      onChange(file);
      const currentImageUrl = URL.createObjectURL(file);
      setProfileImage(currentImageUrl);
    }
  };

  const addUser = async (
    values: z.infer<typeof profileFormSchema>,
    profileImage: string
  ) => {
    const { name, bio } = values;

    const newUser: IUser = {
      id: userId as string,
      nickname: name,
      email: user?.email as string,
      password: "google@135",
      profileImage,
      bio,
      createdAt: getKoreaTimeDate(),
      updatedAt: getKoreaTimeDate(),
    };
    addUserMutation.mutate(newUser);
  };

  const updateUser = async (
    values: z.infer<typeof profileFormSchema>,
    profileImage: string
  ) => {
    const { name, bio } = values;
    const newUser: IUser = {
      id: userData.id,
      nickname: name,
      email: userData.email,
      password: userData.password,
      profileImage,
      bio,
      createdAt: userData.createdAt,
      updatedAt: getKoreaTimeDate(),
    };
    updateUserMutation.mutate(newUser);
  };

  const onSubmitProfileUpdate = async (
    values: z.infer<typeof profileFormSchema>
  ) => {
    setIsLoading(true);
    const { name, image } = values;
    const isStorageImage =
      typeof image === "string" && image.includes("storage");
    try {
      let imageDownloadURL = image;
      if (image instanceof File) {
        imageDownloadURL = await storageAPI.uploadProfileImage(
          user!.uid,
          image
        );
      }
      if (userData && user) {
        isStorageImage && (await storageAPI.deleteProfileImage(user?.uid));
        await updateProfile(user, {
          displayName: name,
          photoURL: imageDownloadURL as string,
        });
        await updateUser(values, imageDownloadURL as string);
      } else if (!userData && user) {
        await updateProfile(user, {
          displayName: name,
          photoURL: imageDownloadURL as string,
        });
        await addUser(values, imageDownloadURL as string);
      }
      toast({
        variant: "green",
        title: "프로필 정보가 업데이트 되었습니다.",
        duration: 1000,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      navigate(`/mypage/${userId}`);
    }
  };

  const validateProfileForm = async () => {
    return await profileForm.trigger(["name", "image", "bio"]);
  };

  const closeButtonHandler = async () => {
    const isValid = await validateProfileForm();
    if (isValid) {
      setIsOpen(false);
    }
  };

  return {
    profileForm,
    isLoading,
    onSubmitProfileUpdate,
    profileImage,
    imageOnChangeHandler,
    closeButtonHandler,
  };
};

export default useProfileForm;

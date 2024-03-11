import { useToast } from "@/components/ui/use-toast";
import {
  signUpFormSchema,
  loginFormSchema,
} from "@/shared/form/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase";

import { IUser } from "@/types/types";
import { useUser } from "@/store/UserContext";
import useUserMutations from "./queries/user/useUserMutations";
import { getKoreaTimeDate } from "@/shared/form/common";
import { storageAPI } from "@/lib/api/storageAPI";
import { userAPI } from "@/lib/api/userAPI";

export type ServerErrorResponse = {
  message: string;
};

const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [profileImage, setProfileImage] = useState("/profileImage.jpeg");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useUser();
  const { addUserMutation } = useUserMutations();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
  });

  const validateExceptIamgeAndBio = async () => {
    return await signUpForm.trigger([
      "name",
      "email",
      "password",
      "confirmPassword",
    ]);
  };

  const keyDownHandler = async (e: any) => {
    const { name } = e.target;
    const isValid = await validateExceptIamgeAndBio();

    if (name === "confirmPassword" && !isValid) {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
      }
    } else if (name === "confirmPassword" && isValid) {
      if ((e.key === "Tab" && !e.shiftKey) || e.key === "Enter") {
        setNextButtonClicked(true);
      }
    } else if (name === "image" && e.key === "Tab" && e.shiftKey) {
      setNextButtonClicked(false);
    }
  };

  const nextButtonHandler = async () => {
    const isValid = await validateExceptIamgeAndBio();
    if (isValid) {
      setNextButtonClicked(!nextButtonClicked);
    }
  };

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

  const onAuthenticationSuccess = () => {
    toast({
      variant: "green",
      title: "로그인되었습니다.",
      duration: 1000,
    });
    navigate("/");
  };

  const addUser = async (
    values: z.infer<typeof signUpFormSchema>,
    uid: string,
    profileImage: string
  ) => {
    const { name, email, password, bio } = values;

    const newUser: IUser = {
      id: uid,
      nickname: name,
      email,
      password,
      profileImage,
      bio,
      createdAt: getKoreaTimeDate(),
      updatedAt: getKoreaTimeDate(),
    };
    addUserMutation.mutate(newUser);
  };

  const onSubmitSignUp = async (values: z.infer<typeof signUpFormSchema>) => {
    const { email, password, name, image } = values;
    setIsLoading(true);
    if (values.password === values.confirmPassword) {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const imageDownloadURL = await storageAPI.uploadProfileImage(
          user.uid,
          image as File
        );
        await updateProfile(user, {
          displayName: name,
          photoURL: imageDownloadURL,
        });
        await addUser(values, user.uid, imageDownloadURL);
        onAuthenticationSuccess();
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "이미 사용 중인 이메일입니다.",
          duration: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "비밀번호가 일치하지 않습니다.",
        duration: 1000,
      });
    }
  };

  const getUserInfoAndSetContext = async (userId: string) => {
    const user = await userAPI.getUserFromDatabase(userId);
    localStorage.setItem("userId", user.id);
    setUser(user);
  };

  const onSubmitLogin = async (values: z.infer<typeof loginFormSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      getUserInfoAndSetContext(user.uid);
      onAuthenticationSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "잘못된 로그인 정보입니다.",
        duration: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToLoginOrSignUp = (path: string) => {
    navigate(`/${path}`);
  };

  return {
    isLoading,
    loginForm,
    onSubmitLogin,
    nextButtonHandler,
    nextButtonClicked,
    profileImage,
    setProfileImage,
    imageOnChangeHandler,
    keyDownHandler,
    signUpForm,
    onSubmitSignUp,
    goToLoginOrSignUp,
  };
};

export default useAuthForm;

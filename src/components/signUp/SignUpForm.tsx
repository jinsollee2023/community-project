import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthForm from "@/hooks/useAuthForm";
import { Textarea } from "../ui/textarea";
import { useRef } from "react";
import { FaCamera } from "react-icons/fa";

export const SignUpForm = () => {
  const {
    isLoading,
    signUpForm,
    onSubmitSignUp,
    goToLoginOrSignUp,
    nextButtonHandler,
    nextButtonClicked,
    profileImage,
    imageOnChangeHandler,
    keyDownHandler,
  } = useAuthForm();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const checkPasswordWithEmail = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const emailId = signUpForm.getValues("email")?.split("@")[0];
    const passwordInputValue = event.target.value;
    if (passwordInputValue?.includes(emailId)) {
      signUpForm.setValue("password", "prevent@135");
      onChange("prevent@135");
    } else {
      onChange(event.target.value);
    }
  };

  return (
    <Form {...signUpForm}>
      <form
        onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
        className="relative overflow-x-hidden"
      >
        <div className="pb-5">
          <div
            className={`px-2 transform ${
              nextButtonClicked ? "-translate-x-full" : "translate-x-0"
            } transition`}
          >
            <div className="p-2 flex flex-col justify-between md:space-x-2 md:flex-row">
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <>
                    <FormItem className="md:w-1/2">
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="홍길동" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <>
                    <FormItem className="md:w-1/2">
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <Input placeholder="hello@sparta.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </div>
            <div className="p-2 flex flex-col justify-between md:flex-row md:space-x-4">
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field: { onChange }, ...field }) => (
                  <>
                    <FormItem className="md:w-1/2">
                      <FormLabel>비밀번호</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          name="password"
                          onChange={(event) => {
                            checkPasswordWithEmail(event, onChange);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <>
                    <FormItem className="md:w-1/2">
                      <FormLabel>비밀번호 확인</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          name="confirmPassword"
                          onKeyDown={keyDownHandler}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </div>
          </div>

          <div
            className={`px-2 space-y-3 absolute top-0 left-0 right-0 transition transform ${
              nextButtonClicked ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-2 flex flex-col justify-between md:flex-row md:space-x-2">
              <FormField
                control={signUpForm.control}
                name="image"
                render={({ field: { onChange }, ...field }) => (
                  <>
                    <FormItem className="w-1/4">
                      <FormLabel>프로필 이미지</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          name="image"
                          className="hidden"
                          onChange={(event) => {
                            imageOnChangeHandler(event, onChange);
                          }}
                        />
                      </FormControl>

                      <div
                        className="w-36 h-36 relative rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url('${profileImage}')` }}
                      >
                        <Button
                          variant="outline"
                          size="mini"
                          type="button"
                          name="image"
                          onKeyDown={keyDownHandler}
                          className="rounded-full absolute bottom-0 right-0"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <FaCamera size={12} />
                        </Button>
                      </div>

                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="bio"
                render={({ field }) => (
                  <>
                    <FormItem className="md:w-3/4">
                      <FormLabel>자기소개</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          name="bio"
                          className="h-36 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </div>
          </div>
        </div>
        <div className="p-2 mt-5 flex gap-2 justify-center sm:justify-start">
          <Button type="button" onClick={nextButtonHandler}>
            {nextButtonClicked ? "이전 단계로" : "다음 단계로"}
          </Button>
          <Button
            className={nextButtonClicked ? "" : "hidden"}
            type="submit"
            disabled={isLoading}
          >
            계정 등록하기
          </Button>
          <Button
            className={nextButtonClicked ? "hidden" : ""}
            type="button"
            onClick={() => goToLoginOrSignUp("login")}
          >
            로그인하기
          </Button>
        </div>
      </form>
    </Form>
  );
};

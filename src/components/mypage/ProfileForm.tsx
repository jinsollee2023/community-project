import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import useProfileForm from "@/hooks/useProfileForm";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useRef } from "react";
import { FaCamera } from "react-icons/fa";

const ProfileForm = () => {
  const {
    profileForm,
    onSubmitProfileUpdate,
    isLoading,
    profileImage,
    imageOnChangeHandler,
    closeButtonHandler,
  } = useProfileForm();

  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <Form {...profileForm}>
      <form
        onSubmit={profileForm.handleSubmit(onSubmitProfileUpdate)}
        className="w-full"
      >
        <div className="flex flex-col space-y-3 sm:flex-row">
          <FormField
            control={profileForm.control}
            name="image"
            render={({ field: { onChange }, ...field }) => (
              <>
                <FormItem className="sm:w-1/3">
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
          <div className="sm:w-2/3">
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <>
                  <FormItem className="">
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
              control={profileForm.control}
              name="bio"
              render={({ field }) => (
                <>
                  <FormItem className="">
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
        <div className="flex justify-center p-2 mt-5 space-x-2">
          <Button type="submit" disabled={isLoading}>
            업데이트
          </Button>
          <Button type="button" onClick={closeButtonHandler}>
            닫기
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;

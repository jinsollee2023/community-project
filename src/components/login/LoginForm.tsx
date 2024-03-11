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

const LoginForm = () => {
  const { loginForm, isLoading, onSubmitLogin, goToLoginOrSignUp } =
    useAuthForm();

  return (
    <>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(onSubmitLogin)}
          className="space-y-3"
        >
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="hello@sparta-devcamp.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <div className="flex gap-2 justify-center">
            <Button type="submit" disabled={isLoading}>
              로그인
            </Button>
            <Button type="button" onClick={() => goToLoginOrSignUp("sign-up")}>
              회원가입하기
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;

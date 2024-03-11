import { SignUpForm } from "@/components/signUp/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignUp = () => {
  return (
    <div className="mt-20">
      <Card className="w-4/5 absolute -translate-x-1/2 -translate-y-5/6 top-5/6 left-1/2  sm:-translate-y-1/2 sm:top-1/2 lg:w-1/2">
        <CardHeader>
          <CardTitle>계정을 생성합니다</CardTitle>
          <CardDescription>필수 정보를 입력해볼게요.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;

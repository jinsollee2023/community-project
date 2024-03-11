import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/login/LoginForm";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useState } from "react";
import GoogleLogin from "@/components/socialLogin/GoogleLogin";
import { IResolveParams } from "@/types/types";

const Login = () => {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState<any>();
  console.log(provider, profile);

  return (
    <div className="mt-20 mx-auto px-[15%]">
      <Card className="w-3/4 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 sm:w-[400px]">
        <CardHeader>
          <CardTitle>로그인합니다</CardTitle>
          <CardDescription>계정 정보를 입력해볼게요.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="flex items-center justify-between my-5">
            <span className="border-b w-[30%] inline-block"></span>
            <span className="w-[30%] text-center font-semibold">
              Social Login
            </span>
            <span className="border-b w-[30%] inline-block"></span>
          </div>
          <GoogleLogin
            client_id={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID as string}
            scope="openid profile email"
            discoveryDocs="claims_supported"
            access_type="offline"
            onResolve={({ provider, data }: IResolveParams) => {
              setProvider(provider);
              setProfile(data);
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <GoogleLoginButton />
          </GoogleLogin>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

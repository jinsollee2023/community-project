import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";

export const AnyRoute = (): React.ReactElement => {
  return <Outlet />;
};

export const PrivateRoute = (): React.ReactElement => {
  const { toast } = useToast();
  const [user, _] = useAuthState(auth);
  const userId = localStorage.getItem("userId") || user?.uid;

  const userCheck = (userId: any | null): boolean => {
    if (userId) {
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "로그인 후에 접근 가능합니다.",
        duration: 1000,
      });
      return false;
    }
  };

  return userCheck(userId) ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoute = (): React.ReactElement => {
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const userId = localStorage.getItem("userId") || user?.uid;

  const userCheck = (userId: any | null): boolean => {
    if (userId) {
      toast({
        variant: "destructive",
        title: "로그인 상태입니다.",
        duration: 1000,
      });
      return true;
    } else {
      return false;
    }
  };
  return userCheck(userId) ? <Navigate to="/" /> : <Outlet />;
};

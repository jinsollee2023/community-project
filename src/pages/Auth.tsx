import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useUser } from "@/store/UserContext";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase";
import { useEffect } from "react";
import { userAPI } from "@/lib/api/userAPI";

const Auth = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = parsedHash.get("access_token");
    const getUserData = async () => {
      try {
        const credential = GoogleAuthProvider.credential(null, accessToken);
        const { user } = await signInWithCredential(auth, credential!);
        localStorage.setItem("userId", user.uid);
        const userDataFromDatabase = await userAPI.getUserFromDatabase(
          user.uid
        );
        if (!userDataFromDatabase) {
          navigate(`/mypage/${user.uid}?newUser`);
        } else {
          setUser(userDataFromDatabase);
          navigate("/");
        }
      } catch (error) {
        throw error;
      }
    };
    accessToken && getUserData();
  }, []);
  return <div></div>;
};

export default Auth;

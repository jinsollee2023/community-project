import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { auth } from "@/firebase";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { toast } = useToast();

  const [user, loading] = useAuthState(auth);
  const userId = localStorage.getItem("userId") || user?.uid;

  const logButtonHandler = async () => {
    if (userId) {
      await signOut(auth);
      localStorage.removeItem("userId");
      toast({
        variant: "green",
        title: "로그아웃 되었습니다.",
        duration: 1000,
      });
    }
    navigate("/login");
  };

  return (
    <div className="h-[10vh] fixed top-0 left-0 w-full mx-auto px-[5%] sm:px-[10%] shadow-sm flex items-center z-50 bg-gray-100">
      <nav className="w-full flex items-center justify-between">
        <span className="cursor-pointer" onClick={() => navigate("/")}>
          Logo
        </span>
        {!loading && userId ? (
          <div className="space-x-2">
            <Button
              className={`${path === "/" ? "hidden" : "none"} hidden sm:inline`}
              onClick={() => navigate("/")}
            >
              홈
            </Button>
            <Button
              className={path === "/explore" ? "hidden" : "none"}
              onClick={() => navigate("/explore")}
            >
              둘러보기
            </Button>
            <Button
              className={path.includes(userId) ? "hidden" : "none"}
              onClick={() => navigate(`/mypage/${userId}`)}
            >
              마이페이지
            </Button>

            <Button onClick={logButtonHandler}>로그아웃</Button>
          </div>
        ) : (
          !loading && (
            <Button
              className={
                path === "/login" || path === "/sign-up" ? "hidden" : "none"
              }
              onClick={logButtonHandler}
            >
              로그인
            </Button>
          )
        )}
      </nav>
    </div>
  );
};

export default NavBar;

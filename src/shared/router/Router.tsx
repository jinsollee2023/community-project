import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnyRoute, PrivateRoute, PublicRoute } from "./PrivateRoute";
import { Suspense, lazy } from "react";

const Layout = lazy(() => import("@/components/layout/Layout"));
const Home = lazy(() => import("@/pages/Home"));
const Auth = lazy(() => import("@/pages/Auth"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Mypage = lazy(() => import("@/pages/Mypage"));
const Explore = lazy(() => import("@/pages/Explore"));
const Post = lazy(() => import("@/pages/Post"));
const PostRegistration = lazy(() => import("@/pages/PostRegistration"));

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>페이지 로딩중...</p>}>
        <Layout>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/mypage/:id" element={<Mypage />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/post-registration" element={<PostRegistration />} />
            </Route>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>
            <Route element={<AnyRoute />}>
              <Route path="/explore" element={<Explore />} />
              <Route path="/auth" element={<Auth />} />
            </Route>
          </Routes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;

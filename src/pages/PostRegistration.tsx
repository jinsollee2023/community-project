import PostForm from "@/components/post/PostForm";
import FallbackUI from "@/components/ui/FallbackUI";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const PostRegistration = () => {
  return (
    <div className="mt-28 mx-auto px-[5%] sm:px-[15%]">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={(error, resetErrorBoundary) => (
              <FallbackUI
                error={error}
                resetErrorBoundary={resetErrorBoundary}
                customMessage="게시물 정보를 가져오는 데 실패했습니다"
              />
            )}
          >
            <PostForm />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
};

export default PostRegistration;

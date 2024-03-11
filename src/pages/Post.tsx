import PostDetail from "@/components/post/PostDetail";
import FallbackUI from "@/components/ui/FallbackUI";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const Post = () => {
  return (
    <div className="mt-24 mb-16 mx-auto px-[5%] sm:px-[15%]">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={(error, resetErrorBoundary) => (
              <FallbackUI
                error={error}
                resetErrorBoundary={resetErrorBoundary}
                customMessage="게시물을 가져오는 데 실패했습니다"
              />
            )}
          >
            <PostDetail />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
};

export default Post;

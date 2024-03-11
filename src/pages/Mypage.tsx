import ProfileCard from "@/components/mypage/ProfileCard";
import FallbackUI from "@/components/ui/FallbackUI";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const Mypage = () => {
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
                customMessage="유저 정보를 가져오는 데 실패했습니다"
              />
            )}
          >
            <ProfileCard />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  );
};

export default Mypage;

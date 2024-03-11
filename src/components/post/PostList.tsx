import usePostsQueries from "@/hooks/queries/post/usePostsQueries";
import { useInView } from "react-intersection-observer";
import _debounce from "lodash/debounce";
import PostCard from "./PostCard";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../layout/LoadingSpinner";
import { IPost } from "@/types/types";

const PostList = () => {
  const {
    allPostData,
    allPostDataIsLoading,
    allPostDataIsError,
    fetchNextAllPostPage,
    hasNextAllPostPage,
    isFetchingNextAllPostPage,
  } = usePostsQueries();

  const { ref, inView } = useInView();
  const debouncedFetchNextPage = _debounce(fetchNextAllPostPage, 500);

  useEffect(() => {
    if (inView && hasNextAllPostPage && !isFetchingNextAllPostPage) {
      debouncedFetchNextPage();
    }
  }, [inView]);

  const navigate = useNavigate();
  const addPostButtonHandler = () => {
    navigate("/post-registration");
  };

  if (allPostDataIsError) {
    return <p>Error...</p>;
  }

  return (
    <div className="space-y-2">
      <div className="px-1 pb-2 flex justify-between items-center">
        <p className="text-xl font-bold">전체 게시글</p>
        <Button variant="outline" onClick={addPostButtonHandler}>
          <RiPencilFill size={15} className="mr-1" />
          글쓰기
        </Button>
      </div>
      {allPostData?.pages.map((group, idx) => (
        <React.Fragment key={idx}>
          {group?.sortedArray?.length > 0 &&
            group.sortedArray.map((post) => (
              <PostCard key={post.id} post={post as IPost} />
            ))}
        </React.Fragment>
      ))}
      {allPostData?.pages.every((group) => group.sortedArray.length === 0) && (
        <p>등록된 포스트가 없습니다.</p>
      )}
      <div ref={ref} className="h-10"></div>
      <LoadingSpinner
        isLoading={allPostDataIsLoading}
        text="게시글 로딩 중.."
      />
    </div>
  );
};

export default PostList;

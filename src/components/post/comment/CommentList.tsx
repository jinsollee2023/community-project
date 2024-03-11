import useCommentsQueries from "@/hooks/queries/comment/useCommentsQueries";
import { useInView } from "react-intersection-observer";
import _debounce from "lodash/debounce";
import React, { useEffect } from "react";
import { IComment } from "@/types/types";
import CommentCard from "./CommentCard";

interface CommentListProps {
  postId: string;
  postUserId: string;
}

const CommentList = ({ postId, postUserId }: CommentListProps) => {
  const {
    fetchNextAllCommentPage,
    hasNextAllCommentPage,
    isFetchingNextAllCommentPage,
    allCommentData,
    allCommentDataIsLoading,
    allCommentDataIsError,
  } = useCommentsQueries({ postId });
  const { ref, inView } = useInView();
  const debouncedFetchNextPage = _debounce(fetchNextAllCommentPage, 500);

  useEffect(() => {
    if (inView && hasNextAllCommentPage && !isFetchingNextAllCommentPage) {
      debouncedFetchNextPage();
    }
  }, [inView]);

  if (allCommentDataIsLoading) {
    return <p>Loading...</p>;
  }

  if (allCommentDataIsError) {
    return <p>Error...</p>;
  }

  return (
    <div className="py-4 space-y-4">
      {allCommentData?.pages.map((group, idx) => (
        <React.Fragment key={idx}>
          {group?.sortedArray?.length > 0 &&
            group.sortedArray.map((comment) => (
              <div className="pb-4 border-b" key={comment.id}>
                <CommentCard
                  commentData={comment as IComment}
                  postUserId={postUserId as string}
                />
              </div>
            ))}
        </React.Fragment>
      ))}
      {allCommentData?.pages.every(
        (group) => group?.sortedArray?.length === 0
      ) && <p>등록된 댓글이 없습니다.</p>}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};

export default CommentList;

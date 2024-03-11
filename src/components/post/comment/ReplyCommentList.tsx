import useReplyCommentsQueries from "@/hooks/queries/comment/useReplyCommentsQueries";
import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import CommentCard from "./CommentCard";
import { IComment } from "@/types/types";

interface ReplyCommentListProps {
  commentId: string;
  replyCount: number;
  postUserId: string;
}

const ReplyCommentList = ({
  commentId,
  replyCount,
  postUserId,
}: ReplyCommentListProps) => {
  const [isReplyCommentsOpen, setIsReplyCommentsOpen] = useState(false);
  const {
    fetchNextReplyCommentPage,
    hasNextReplyCommentPage,
    isFetchingNextReplyCommentPage,
    replyCommentData,
    replyCommentDataIsLoading,
  } = useReplyCommentsQueries({ commentId });

  const replyOpenButtonHandler = () => {
    if (!isReplyCommentsOpen) {
      setIsReplyCommentsOpen(true);
    }
    if (
      replyCount > 20 &&
      !isFetchingNextReplyCommentPage &&
      hasNextReplyCommentPage &&
      isReplyCommentsOpen
    ) {
      fetchNextReplyCommentPage();
    }
  };

  if (replyCommentDataIsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {isReplyCommentsOpen &&
        replyCommentData?.pages.map((group, idx) => (
          <React.Fragment key={idx}>
            {group?.sortedArray?.length > 0 &&
              group.sortedArray.map((comment) => (
                <CommentCard
                  key={comment.id}
                  commentData={comment as IComment}
                  postUserId={postUserId as string}
                />
              ))}
          </React.Fragment>
        ))}
      {replyCount > 0 && (
        <div
          className={`pt-2 flex items-center space-x-1 cursor-pointer ${
            isReplyCommentsOpen && replyCount < 20 ? "hidden" : ""
          }`}
          onClick={replyOpenButtonHandler}
        >
          <span>
            <IoIosArrowDown size={18} />
          </span>
          <span className="text-sm font-semibold text-gray-600">
            답글 {replyCount > 20 ? "20" : replyCount}개 더 보기
          </span>
        </div>
      )}
      {isReplyCommentsOpen && (
        <div
          className="pt-2 flex items-center space-x-1 cursor-pointer"
          onClick={() => setIsReplyCommentsOpen(false)}
        >
          <span>
            <IoIosArrowUp size={18} />
          </span>
          <span className="text-sm font-semibold text-gray-600">
            답글 숨기기
          </span>
        </div>
      )}
    </>
  );
};

export default ReplyCommentList;
